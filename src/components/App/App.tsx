import { useState } from 'react';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { Loader } from '../Loader/Loader';
import { MovieGrid } from '../MovieGrid/MovieGrid';
import { MovieModal } from '../MovieModal/MovieModal';
import { SearchBar } from '../SearchBar/SearchBar';
import type { Movie } from '../../types/movie';
import { getMovies } from '../../services/movieService';
import { useQuery } from '@tanstack/react-query';
import Pagination from '../ReactPaginate/ReactPaginate';




function App() {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);

    const handleSearch = (query: string) => {
       setQuery(query);
       setPage(1);
    }

     const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => getMovies(query, page),
    enabled: query !== '',
  });



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