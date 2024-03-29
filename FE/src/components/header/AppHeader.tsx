import React, { useState } from 'react';
import { Layout, Avatar, Button, Image } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth.service';
import { useSession } from '../../context/SessionContext';
import logo from '../../assets/logo.png';
import MovieSuggestions from './MovieSuggestions/MovieSuggestions';

const { Header } = Layout;

const AppHeader: React.FC<{ profileImageUrl?: string }> = ({ profileImageUrl }) => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setLoggedUser } = useSession();
  const [searchValue, setSearchValue] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setLoggedUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const onSearch = (searchText: string) => {
    setSearchValue(searchText);
  };

  const goToNowPlayingMovies = () => {
    navigate('/movies');
  };

  return (
    <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px' }}>
      <Image src={logo} preview={false} style={{ cursor: 'pointer', marginBottom: '20px' }} height={'50px'} onClick={goToNowPlayingMovies} />
      <MovieSuggestions searchValue={searchValue} onSearch={onSearch} />
      <div>
        <Avatar
          style={{ cursor: 'pointer' }}
          size="large"
          onClick={goToProfile}
          icon={<UserOutlined />}
          src={profileImageUrl}
        />
        <Button type="primary" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </Header>
  );
};

export default AppHeader;
