import toast, { Toaster } from 'react-hot-toast';
import css from "./App.module.css";
import { getMovies } from '../../services/movieService';
import { useState } from "react";
import { useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import type { Movie } from '../../types/movie';
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;


export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

 const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', searchQuery, page],
    queryFn: () => getMovies(searchQuery, page),
   enabled: searchQuery.length > 0,
    placeholderData: (previousData) => previousData,
 });
  
  const onSubmit = (newQuery: string) => {
    setSearchQuery(newQuery);
    setPage(1);
  };

  const onSelect = (movie: Movie) => { 
    setSelectedMovie(movie);
  };

  const onClose = () => {
    setSelectedMovie(null);
  };

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  useEffect(() => {
    if (searchQuery && !isLoading && !isError && movies.length === 0) {
      toast.error("No movies found for your request.", { id: "empty-search" });
    }
  }, [movies.length, searchQuery, isLoading, isError]);
  
  

  return (
    <div className={css.app}>
      <SearchBar onSubmit={onSubmit} />
      {!isLoading && !isError && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {movies.length > 0 && <MovieGrid onSelect={onSelect} movies={movies} />}
      {isError && <ErrorMessage/>}
      {isLoading && <Loader />}
      <Toaster
      position="bottom-center"
      reverseOrder={true}
      />
      {selectedMovie && <MovieModal onClose={onClose} movie={selectedMovie} />}
    </div>
  )
}