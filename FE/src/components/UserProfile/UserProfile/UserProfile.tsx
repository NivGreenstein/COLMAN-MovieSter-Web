import React, {useEffect, useState} from 'react';
import { Avatar, Button, Card, Col, Row, Statistic, Layout } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const UserProfile: React.FC = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        profileImage: "", // Initial state with no image path
        moviesRated: 0,
        profileViews: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
                // This is where you would fetch data from your backend
                // For now, we'll use static data
                setUserData({
                    profileImage: "path_to_profile_image.jpg",
                    moviesRated: 120,
                    profileViews: 89,
                });
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs once on mount


    const handleEditProfileClick = () => {
        navigate('/edit-profile'); // The route you'll use for the edit profile page
    };

    return (
        <Layout>
            <Content style={{ background: 'white', margin: 0, minHeight: '80vh' }}>
                <Row justify="space-between" align="top" style={{ padding: '1vh' }}>
                    <Col>
                        <Button onClick={handleEditProfileClick}  style={{ marginRight: '110vh' }} type="primary" shape="round" icon={<EditOutlined />}>
                            Edit Profile
                        </Button>
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
