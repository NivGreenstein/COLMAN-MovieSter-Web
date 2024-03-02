import React from 'react';
import {Layout, Input, Avatar, Button} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {logout} from '../../services/auth.service';
import {useSession} from "../../context/SessionContext";

const {Header} = Layout;
const {Search} = Input;

const AppHeader: React.FC<{ profileImageUrl?: string }> = ({profileImageUrl}) => {
  const navigate = useNavigate();
    const {setIsLoggedIn} = useSession();

    const handleLogout = async () => {
        try {
            await logout();
            setIsLoggedIn(false);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };


    const handleSearch = (value: string) => {
        console.log(value);
    };

    const goToProfile = () => {
        navigate('/profile');
    };

    return (
        <Header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px'}}>
            <Button type="primary" onClick={handleLogout}>Log out</Button>
            <Search
                placeholder="Search movies"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
        enterButton
        size="large"
        style={{
          borderRadius: '25px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          width: '600px',
                }}
            />
            <Avatar size="large" onClick={goToProfile} icon={<UserOutlined/>} src={profileImageUrl}/>
        </Header>
    );
};

export default AppHeader;
