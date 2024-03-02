import React, { useEffect, useState } from 'react';
import { Layout, Input, Row, Col, Avatar, Button } from 'antd';
import Movie from '../MoviesPage/MovieTab';
import { IMovie } from '../../types/IMovie';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../header/AppHeader';
import { getNowPlayingMovies, searchMovies } from '../../services/movies.service';

const { Header, Content } = Layout;
const { Search } = Input;

const MovieListPage: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<IMovie[]>([]);
  // const [searchMovieValue, setSearchMovieValue] = useState<string>('');

  useEffect(() => {
    const fetchMovies = async () => {
      if (true) {
        const data = await getNowPlayingMovies();
        setMovies(data);
        return;
      }

      // const data = await searchMovies(searchMovieValue);
      // setMovies(data);
    };
    fetchMovies();
  }, []);

  // const handleSearch = (value: string) => {
  //   setSearchMovieValue(value);
  // };

  // const goToProfile = () => {
  //   navigate('/profile');
  // };

  // const handleLogout = () => {};

  return (
    <Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <Content style={{ padding: '50px' }}>
        <Row gutter={[16, 16]}>
          {movies.map((movie) => (
            <Col key={movie.id} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Movie movie={movie} />
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default MovieListPage;
