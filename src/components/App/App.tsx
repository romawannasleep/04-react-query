import type { Movie } from "../../types/movie";
import toast, { Toaster } from "react-hot-toast";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import SearchBar from "../SearchBar/SearchBar";
import Pagination from "../Pagination/Pagination";
import css from "./App.module.css";
import { fetchMovies } from "../../services/movieService";
import MovieModal from "../MovieModal/MovieModal";
import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function App() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query.trim() !== "", // Only fetch when query is not empty
    placeholderData: keepPreviousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;
  const hasSearched = query.trim() !== "";

  useEffect(() => {
    if (
      hasSearched &&
      !isLoading &&
      !isError &&
      movies.length === 0
    ) {
      toast.error(`No movies found for "${query}"`);
    }
  }, [hasSearched, isLoading, isError, movies.length, query]);
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setCurrentPage(1);
  };

  const openModal = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && hasSearched && <Loader />}
      {isError && hasSearched && <ErrorMessage />}
      {hasSearched && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={openModal} />
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
      {selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
    </div>
  );
}
