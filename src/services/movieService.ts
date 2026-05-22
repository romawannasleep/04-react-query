import type { Movie } from '../types/movie';
import axios from 'axios';
const myKey = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';
const TOKEN = `Bearer ${myKey}`;

interface MoviesHttpResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: Movie[];
}
export const fetchMovies = async (query: string, page: number) => {
  const response = await axios.get<MoviesHttpResponse>(
    `${BASE_URL}/search/movie`,
    {
      params: {
        query,
        include_adult: false,
        language: 'en-US',
        page,
      },
      headers: {
        Authorization: `${TOKEN}`,
      },
    }
  );
  return response.data;
};