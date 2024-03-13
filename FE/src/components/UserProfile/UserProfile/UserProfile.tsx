import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Col, Row, Statistic, Layout } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import CommentList from '../../Comments/CommentsList';
import { Comment } from '../../../types/IComment';
import { IUser } from '../../../types/IUser';
import { useSession } from '../../../context/SessionContext';
import { getUserById } from '../../../services/user.service';
import { getCommentsByUserId } from '../../../services/comments.service';
import Title from 'antd/lib/typography/Title';

const { Content } = Layout;

interface UserProfileProps {}

const UserProfile: React.FC<UserProfileProps> = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState<IUser | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [imagePreview, setImagePreview] = useState('');

  const { loggedUser } = useSession();

  useEffect(() => {
    if (id) {
      getUserById(id).then((userResponse) => setUser(userResponse));
    } else {
      if (loggedUser?._id) {
        getUserById(loggedUser._id).then((userResponse) => setUser(userResponse));
      }
    }
    if (!id && !loggedUser) throw new Error('No user found');

    if (!loggedUser) throw new Error('No user found');
    getCommentsByUserId(id ?? loggedUser?._id).then((commentsResponse) => setComments(commentsResponse));
  }, []);

  const handleEditProfileClick = () => {
    navigate('/edit-profile'); // The route you'll use for the edit profile page
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Content style={{ background: 'white', padding: '30px 30px 30px 30px', minHeight: '100vh', minWidth: '100vw' }}>
        <Row gutter={16} justify="space-between" align="top" style={{ padding: '1vh' }}>
          <Col span={12}>
            {user._id === loggedUser?._id && (
            <Button
              onClick={handleEditProfileClick}
              style={{ marginRight: '110vh', marginBottom: '100px' }}
              type="primary"
              shape="round"
              icon={<EditOutlined />}
            >
              Edit Profile
            </Button>
            )}
            <CommentList
              comments={comments}
              isMoviePage={false}
              setComments={setComments}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
            />
          </Col>
          <Col span={4} style={{ textAlign: 'center' }}>
            <Avatar
              size={120}
              shape="circle"
              src={
                user?.isGoogleUser
                  ? user?.profilePictureUrl
                  : `${import.meta.env.VITE_API_URI}/${user?.profilePictureUrl}`
              }
            />
            <Title level={2} style={{ marginTop: 16 }}>
              {user.username}
            </Title>
            <Row justify="center" style={{ padding: '16px 0' }}>
              <Card title="Statistics" style={{ width: 300 }}>
                <Statistic title="Movies Rated" value={comments.length} />
                <Statistic
                  title="Average Rating"
                  value={
                    comments.length
                      ? (comments.reduce((sum, comment) => comment.rating + sum, 0) / comments.length).toFixed(2)
                      : 0
                  }
                />
              </Card>
            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default UserProfile;
