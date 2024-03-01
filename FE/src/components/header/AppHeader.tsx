// src/components/AppHeader.tsx

import React from 'react';
import { Layout, Input, Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Search } = Input;

interface AppHeaderProps {
  handleLogout: () => void;
  handleSearch: (value: string) => void;
  goToProfile: () => void;
  profileImageUrl?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ handleLogout, handleSearch, goToProfile, profileImageUrl }) => {
  return (
    <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px' }}>
      <Button type="primary" onClick={handleLogout}>
        Log out
      </Button>
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
      <Avatar size="large" onClick={goToProfile} icon={<UserOutlined />} src={profileImageUrl} />
    </Header>
  );
};

export default AppHeader;
