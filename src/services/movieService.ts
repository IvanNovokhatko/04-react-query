import axios from "axios";
import type { Movie } from "../types/movie";

const VITE_TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface getMoviesProps {
    results: Movie[];
    total_pages: number;
    page: number;
    total_results: number;
}

export const getMovies = async (query: string, page: number = 1): Promise<getMoviesProps> => {
  const response = await axios.get<getMoviesProps>(
      `https://api.themoviedb.org/3/search/movie`, 
      {
          params: {
              query: query,
              page: page,
  },
          headers: {
              accept: 'application/json',
              Authorization: `Bearer ${VITE_TMDB_TOKEN}`
            
          },
      }
  );
  return response.data;
};