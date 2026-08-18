import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { Loader } from '../Loader/Loader';
import { MovieGrid } from '../MovieGrid/MovieGrid';
import { MovieModal } from '../MovieModal/MovieModal';
import { SearchBar } from '../SearchBar/SearchBar';
import type { Movie } from '../../types/movie';
import { getMovies } from '../../services/movieService';
import { useQuery } from '@tanstack/react-query';
import Pagination from '../ReactPaginate/ReactPaginate';
import toast from 'react-hot-toast';

import { useState, useEffect } from 'react';

function App() {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);

    const handleSearch = (query: string) => {
       setQuery(query);
       setPage(1);
    }

     const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => getMovies(query, page),
    enabled: query !== '',
    placeholderData: previousData => previousData,
  });

  useEffect(() => {
  if (isSuccess && data.results.length === 0) {
    toast.error('No movies found');
  }
}, [isSuccess, data]);



  return (
    <>

    <SearchBar onSubmit={handleSearch}/>
    {isLoading && <Loader/>}
    {isError && <ErrorMessage/>}


      {selectedMovie && (
   <MovieModal
    movie={selectedMovie}
    onClose={() => setSelectedMovie(null)}
  />
)}
 {data && <MovieGrid
  movies = {data.results}
  onSelect={setSelectedMovie}
  />}
  {data && data.total_pages > 1 && <Pagination 
  totalPages={data?.total_pages ?? 0}
  selected={page}
  onPageChange={setPage}/>}
    </>
  )
}

export default App