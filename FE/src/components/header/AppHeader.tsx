import React, { useState } from 'react';
import { Layout, Avatar, Button, AutoComplete, Image } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth.service';
import { useSession } from '../../context/SessionContext';
import logo from '../../assets/logo.png';
import useMovieSuggestions from './MovieSuggestions/MovieSuggestions';

const { Header } = Layout;

const AppHeader: React.FC<{ profileImageUrl?: string }> = ({ profileImageUrl }) => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setLoggedUser } = useSession();
  const [searchValue, setSearchValue] = useState('');
  const suggestions = useMovieSuggestions(searchValue);

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

  const onSelect = (value, option) => {
    navigate(`/movie/${option.key}`);
  };

  const onSearch = (searchText) => {
    setSearchValue(searchText);
  };

  const goToNowPlayingMovies = () => {
    navigate('/movies');
  };

  return (
    <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px' }}>
      <Image src={logo} preview={false} style={{ cursor: 'pointer' }} height={'50px'} onClick={goToNowPlayingMovies} />
      <AutoComplete
        options={suggestions}
        size={'large'}
        onSelect={onSelect}
        style={{ borderRadius: '25px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '600px' }}
        onSearch={onSearch}
        placeholder="Search movies"
      />
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
