import React, { useEffect, useMemo, useState } from 'react';
import { Layout, Row, Col, Rate, Typography, Divider, Button } from 'antd';
import CommentList from '../Comments/CommentsList';
import { Comment, CommentBase, CommentFullSchema, CommentSchema } from '../../types/IComment';
import { IMovie } from '../../types/IMovie';
import { useParams } from 'react-router-dom';
import { fetchMovieById } from '../../services/movies.service';
import { createComment, getCommentsByMovieId, patchComment, deleteComment } from '../../services/comments.service';
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

  const userExistingComment = useMemo(() => {
    return comments.find(({ userId }) => userId === loggedUser?._id);
  }, [comments, loggedUser]);

  useEffect(() => {
    if (userExistingComment) {
      setDescription(userExistingComment.description);
      setRating(userExistingComment.rating);
    }
  }, [userExistingComment]);

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
    if (userExistingComment) {
      const commentToUpdate = {
        _id: userExistingComment._id,
        description: description,
        rating: rating,
      };
      CommentFullSchema.partial().parse(commentToUpdate);

      const updatedComment = await patchComment(commentToUpdate);

      if (updatedComment) {
        console.log('Comment updated', updatedComment);
        const updatedComments = comments.filter((comment) => comment._id !== userExistingComment._id);
        setComments([
          ...updatedComments,
          {
            ...userExistingComment,
            description: description,
            rating: rating,
          },
        ]);
        setIsModalVisible(false);
      }
      return;
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

  const handleOnDeleteComment = async () => {
    if (!userExistingComment) {
      throw new Error('Comment not found');
    }
    const commentToDelete = userExistingComment._id;
    const response = await deleteComment(commentToDelete);
    if (response?.ok) {
      console.log('Comment deleted', response);
      const updatedComments = comments.filter((comment) => comment._id !== userExistingComment._id);
      setComments(updatedComments);
      setIsModalVisible(false);
      restartAddCommentStates();
    }
  };

  const handleEditComment = () => {
    setIsModalVisible(true);
  };

  if (!movie) {
    return <div style={{ width: '100%', height: 'auto', maxHeight: '100vh', maxWidth: '100vw' }}>Loading...</div>;
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
            <Row gutter={4}>
              <Col span={4}>
                <p>Official Rating:</p>
                <Rate disabled value={movie.rating / 2} />
              </Col>
              <Col span={4}>
                <p>Users' Rating</p>
                <Rate
                  disabled
                  value={
                    comments.length ? comments.reduce((sum, comment) => comment.rating + sum, 0) / comments.length : 0
                  }
                />
              </Col>
            </Row>
            <Paragraph>{movie.description}</Paragraph>
            <Divider />
            <Button type="primary" onClick={showModal} disabled={!!userExistingComment}>
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
              isEditMode={!!userExistingComment}
              restartStates={restartAddCommentStates}
            />
            <CommentList
              comments={comments}
              isMoviePage={true}
              handleDeleteComment={handleOnDeleteComment}
              handleEditComment={handleEditComment}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default MovieInfoPage;
