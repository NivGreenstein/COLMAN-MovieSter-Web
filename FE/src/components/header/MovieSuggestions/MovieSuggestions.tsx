import React, { useEffect, useState } from 'react';
import { IMovie } from '../../../types/IMovie';
import { searchMovies } from '../../../services/movies.service';
import { AutoComplete } from 'antd';
import { useNavigate } from 'react-router-dom';

interface MovieSuggestionsProps {
  searchValue: string;
  onSearch: (value: string) => void;
}

const MovieSuggestions: React.FC<MovieSuggestionsProps> = ({ searchValue, onSearch }) => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<{ key: string; value: string; label: JSX.Element }[]>([]);

  const onSelect = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

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
                value: `${movie.title}`,
                label: (
                  <div
                    key={movie.id.toString()}
                    style={{ display: 'flex', alignItems: 'center' }}
                    onClick={() => onSelect(movie.id.toString())}
                  >
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

  return (
    <AutoComplete
      options={suggestions}
      size={'large'}
      onSelect={() => {}}
      style={{ borderRadius: '25px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '600px' }}
      onSearch={onSearch}
      placeholder="Search movies"
    />
  );
};

export default MovieSuggestions;
