import React from 'react';
import { IMovie } from '../../types/IMovie';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';

interface MovieProps {
  movie: IMovie;
}

const Movie: React.FC<MovieProps> = ({ movie }) => {
  const navigate = useNavigate();

  const handleMovieClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <Card
      onClick={handleMovieClick}
      hoverable
      style={{ width: 240 }}
      cover={<img alt={movie.title} src={movie.posterUrl} />}
    >
      <Card.Meta title={movie.title} />
    </Card>
  );
};

export default Movie;
