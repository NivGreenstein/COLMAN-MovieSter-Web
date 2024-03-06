import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Layout, Row, Col } from 'antd';
import Movie from '../MoviesPage/MovieTab';
import { IMovie } from '../../types/IMovie';
import { getNowPlayingMovies } from '../../services/movies.service';

const { Content } = Layout;

const MovieListPage: React.FC = () => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const initialRender = useRef(true);

  const lastMovieElementRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !initialRender.current) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      getNowPlayingMovies(page).then((data) => setMovies((prevMovies) => [...prevMovies, ...data]));
    }
  }, [page]);

  return (
    <Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <Content style={{ padding: '50px' }}>
        <Row gutter={[16, 16]}>
          {movies.map((movie, index) => (
            <Col
              ref={index === movies.length - 1 ? lastMovieElementRef : null}
              key={`${movie.id}-${index}`}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={4}
            >
              <Movie movie={movie} />
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default MovieListPage;
