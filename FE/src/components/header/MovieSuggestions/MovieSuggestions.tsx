// MovieSuggestions.js
import { useEffect, useState } from 'react';
import { searchMovies } from '../../../services/movies.service';
import { IMovie } from '../../../types/IMovie';

const useMovieSuggestions = (searchValue: string) => {
  const [suggestions, setSuggestions] = useState<{ key: string; value: string; label: JSX.Element }[]>([]);

  useEffect(() => {
    let isActive = true;

    const fetchSuggestions = async () => {
      if (searchValue && searchValue.length > 1) {
        try {
          const data = await searchMovies(searchValue);
          if (isActive) {
            setSuggestions(
              data.map((movie: IMovie) => ({
                key: movie.id.toString(),
                value: movie.title.toString(),
                label: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={movie.posterUrl} alt={movie.title} style={{ width: 50, marginRight: 10 }} />
                    {movie.title}
                  </div>
                ),
              })),
            );
          }
        } catch (error) {
          console.error('Failed to fetch movie suggestions', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 500);

    return () => {
      clearTimeout(delayDebounce);
      isActive = false;
    };
  }, [searchValue]);

  return suggestions;
};

export default useMovieSuggestions;
