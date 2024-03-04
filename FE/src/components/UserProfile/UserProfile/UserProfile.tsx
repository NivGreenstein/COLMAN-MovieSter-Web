import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Col, Row, Statistic, Layout } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import CommentList from '../../Comments/CommentsList';
import { Comment, CommentFullSchema } from '../../../types/IComment';
import { IUser } from '../../../types/IUser';
import { useSession } from '../../../context/SessionContext';
import { getUserById } from '../../../services/user.service';
import { deleteComment, getCommentsByUserId, patchComment } from '../../../services/comments.service';
import AddCommentDialog from '../../Comments/AddCommentDialog';

const { Content } = Layout;

interface UserProfileProps {}
const UserProfile: React.FC<UserProfileProps> = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState<IUser | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [commentIdToEdit, setCommentIdToEdit] = useState('');

  const { loggedUser } = useSession();

  useEffect(() => {
    if (id) {
      getUserById(id).then((userResponse) => setUser(userResponse));
    } else {
      setUser(loggedUser);
    }
    if (!id && !loggedUser) throw new Error('No user found');

    getCommentsByUserId(id ?? loggedUser?._id).then((commentsResponse) => setComments(commentsResponse));
  }, []);

  const handleEditProfileClick = () => {
    navigate('/edit-profile'); // The route you'll use for the edit profile page
  };

  const handleDeleteComment = async (commentId: string) => {
    const response = await deleteComment(commentId);
    if (response?.ok) {
      console.log('Comment deleted', response);
      const updatedComments = comments.filter((comment) => comment._id !== commentId);
      setComments(updatedComments);
    }
  };

  const handleEditButtonClick = (commentId: string) => {
    setCommentIdToEdit(commentId);
    setIsModalVisible(true);
  };

  const handleEdit = async () => {
    if (!commentIdToEdit) throw new Error('No comment to edit');

    const commentToUpdate = {
      _id: commentIdToEdit,
      description: description,
      rating: rating,
    };
    CommentFullSchema.partial().parse(commentToUpdate);
    const response = await patchComment(commentToUpdate);
    if (response?.ok) {
      console.log('Comment updated', response);
      const updatedComments = comments.map((comment) =>
        comment._id === commentIdToEdit ? { ...comment, ...commentToUpdate } : comment,
      );
      setComments(updatedComments);
      setIsModalVisible(false);
      setCommentIdToEdit('');
    } else {
      console.error('Error updating comment', response);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Layout>
        <Content style={{ background: 'white', padding: '30px 30px 30px 30px', minHeight: '100vh', minWidth: '100vw' }}>
          <Row gutter={16} justify="space-between" align="top" style={{ padding: '1vh' }}>
            <Col span={12}>
              <Button
                onClick={handleEditProfileClick}
                style={{ marginRight: '110vh', marginBottom: '100px' }}
                type="primary"
                shape="round"
                icon={<EditOutlined />}
              >
                Edit Profile
              </Button>
              <CommentList
                comments={comments}
                isMoviePage={false}
                handleDeleteComment={handleDeleteComment}
                handleEditComment={handleEditButtonClick}
              />
            </Col>
            <Col span={4} style={{ alignItems: 'center' }}>
              <Avatar size={120} shape="circle" src={user?.profilePictureUrl} />
              <Row justify="center" style={{ padding: '50px 0px 24px' }}>
                <Col>
                  <Card title="Statistics" style={{ width: 300 }}>
                    <Statistic title="Movies Rated" value={comments.length} />
                    <Statistic
                      title="Rating Average"
                      value={
                        comments.length
                          ? (comments.reduce((sum, comment) => comment.rating + sum, 0) / comments.length).toFixed(2)
                          : 0
                      }
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Content>
      </Layout>
      <AddCommentDialog
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        handleSubmit={handleEdit}
        rating={rating}
        setRating={setRating}
        description={description}
        setDescription={setDescription}
        isEditMode={true}
        restartStates={() => {
          setDescription('');
          setRating(0);
        }}
      />
    </>
  );
};

export default UserProfile;
