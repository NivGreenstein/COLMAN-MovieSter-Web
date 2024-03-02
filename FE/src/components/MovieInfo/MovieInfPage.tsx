import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Rate, Typography, Divider, Button } from 'antd';
import CommentList from '../Comments/CommentsList';
import { Comment, CommentBase, CommentSchema } from '../../types/IComment';
import { IMovie } from '../../types/IMovie';
import { useParams } from 'react-router-dom';
import { fetchMovieById } from '../../services/movies.service';
import { createComment, getCommentsByMovieId } from '../../services/comments.service';
import AddCommentDialog from '../Comments/AddCommentDialog';
import { useSession } from '../../context/SessionContext';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const MovieInfoPage: React.FC = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const { loggedUser } = useSession();

  const showModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (id) {
      fetchMovieById(id).then((data) => setMovie(data));
      getCommentsByMovieId(id).then((data) => setComments(data ?? []));
    }
  }, [id]);

  const restartAddCommentStates = () => {
    setDescription('');
    setRating(0);
  };

  const handleSubmit = async () => {
    if (!movie || !loggedUser) {
      throw new Error('Movie not found or User not logged in.');
    }

    const commentToCreate: CommentBase = {
      description: description,
      rating: rating,
      movieId: movie?.id ?? 0,
      userId: loggedUser._id,
    };
    CommentSchema.parse(commentToCreate);

    const createdComment = await createComment(commentToCreate);

    if (createdComment) {
      console.log('Comment created', createdComment);
      getCommentsByMovieId(`${movie.id}`).then((data) => setComments(data ?? []));
      restartAddCommentStates();
      setIsModalVisible(false);
    }
  };

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
            <Button type="primary" onClick={showModal}>
              Create Comment
            </Button>
            <AddCommentDialog
              isModalVisible={isModalVisible}
              setIsModalVisible={setIsModalVisible}
              handleSubmit={handleSubmit}
              rating={rating}
              setRating={setRating}
              description={description}
              setDescription={setDescription}
              isEditMode={false}
              restartStates={restartAddCommentStates}
            />
            <CommentList comments={comments} isMoviePage={true} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default MovieInfoPage;
