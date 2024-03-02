import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Rate, Typography, Divider } from 'antd';
import CommentList from '../Comments/CommentsList';
import { Comment } from '../../types/IComment';
import { IMovie } from '../../types/IMovie';
import { useParams } from 'react-router-dom';
import { fetchMovieById } from '../../services/movies.service';
import { getCommentsByMovieId } from '../../services/comments.service';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const MovieInfoPage: React.FC = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (id) {
      fetchMovieById(id).then((data) => setMovie(data));
      getCommentsByMovieId(id).then((data) => setComments(data ?? []));
    }
  }, [id]);

  if (!movie) {
    return <div style={{ width: '100%', height: 'auto' , maxHeight: '100vh', maxWidth: '100vw'}}>Loading...</div>;
  }
  return (
    <Layout>
      <Content style={{ padding: '2rem' }}>
        <Row gutter={16}>
          <Col span={8}>
            <img src={movie.posterUrl} alt={movie.title} style={{ width: '100%', height: 'auto' }} />
          </Col>
          <Col span={16}>
            <Title level={2}>{movie.title}</Title>
            <Rate value={movie.rating / 2} />
            <Paragraph>{movie.description}</Paragraph>
            <Divider />
            <CommentList comments={comments} isMoviePage={true} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default MovieInfoPage;
