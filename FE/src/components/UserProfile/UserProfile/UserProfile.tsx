import React, {useEffect, useState} from 'react';
import { Avatar, Button, Card, Col, Row, Statistic, Layout } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CommentList from "../../Comments/CommentsList";
import {IUserComment} from "../../../types/IComment";

const { Content } = Layout;

const UserProfile: React.FC = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        profileImage: "", // Initial state with no image path
        moviesRated: 0,
        profileViews: 0,
        comments: [] as IUserComment[], // Add comments to the state
    });

    useEffect(() => {
        const fetchData = async () => {
            // This is where you would fetch data from your backend
            // For now, we'll use static data
            setUserData({
                profileImage: "path_to_profile_image.jpg",
                moviesRated: 120,
                profileViews: 89,
                comments: [
                    // Replace with actual data fetched
                    { movieTitle: 'Inception', rating: 5, text: 'Great movie!', date: new Date() },
                    // ...more comments
                ],
            });
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs once on mount


    const handleEditProfileClick = () => {
        navigate('/edit-profile'); // The route you'll use for the edit profile page
    };

    return (
        <Layout>
            <Content style={{ background: 'white', padding: '30px 30px 30px 30px', minHeight: '100vh', minWidth: '100vw' }}>
                <Row justify="space-between" align="top" style={{ padding: '1vh' }}>
                    <Col>
                        <Button onClick={handleEditProfileClick}  style={{ marginRight: '110vh', marginBottom: '100px' }} type="primary" shape="round" icon={<EditOutlined />}>
                            Edit Profile
                        </Button>
                        <CommentList comments={userData.comments} isMoviePage={false} />
                    </Col>
                    <Col style={{ alignItems: 'center' }} >
                        <Avatar  size={120} shape="circle" src={userData.profileImage} />
                        <Row justify="center" style={{ padding: '50px 0px 24px' }}>
                            <Col>
                                <Card title="Statistics" style={{ width: 300 }}>
                                    <Statistic title="Movies Rated" value={userData.moviesRated}  />
                                    <Statistic title="Profile Views" value={userData.profileViews} />
                                    {/* Add more statistics as needed */}
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
