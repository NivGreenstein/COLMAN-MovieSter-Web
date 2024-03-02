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

const { Content } = Layout;

interface UserProfileProps {}
const UserProfile: React.FC<UserProfileProps> = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState<IUser | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

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

  if (!user || !comments.length) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Content style={{ background: 'white', margin: 0, minHeight: '80vh' }}>
        <Row justify="space-between" align="top" style={{ padding: '1vh' }}>
          <Col>
            <Button
              onClick={handleEditProfileClick}
              style={{ marginRight: '110vh', marginBottom: '100px' }}
              type="primary"
              shape="round"
              icon={<EditOutlined />}
            >
              Edit Profile
            </Button>
            <CommentList comments={comments} isMoviePage={false} />
          </Col>
          <Col style={{ alignItems: 'center' }}>
            <Avatar size={120} shape="circle" src={user?.profilePictureUrl} />
            <Row justify="center" style={{ padding: '50px 0px 24px' }}>
              <Col>
                <Card title="Statistics" style={{ width: 300 }}>
                  <Statistic title="Movies Rated" value={comments.length} />
                  <Statistic
                    title="Rating Average"
                    value={comments.reduce((sum, comment) => comment.rating + sum, 0) / comments.length}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default UserProfile;
