import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './GoogleLoginButton.css';
import authService from '../../../services/auth.service';
import { useSession } from '../../../context/SessionContext';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../../../types/IUser';

const GoogleLoginButton: React.FC = () => {
  const { setIsLoggedIn, setLoggedUser } = useSession();
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        authService
          .loginGoogle(credentialResponse.credential ?? '')
          .then(async () => {
            try {
              setIsLoggedIn(true);
              const user = await authService.getCurrentUserData();
              setLoggedUser(user as IUser);
              navigate('/movies');
            } catch (error) {
              console.error('Login failed:', error);
            }
          })
          .catch((errorInfo) => {
            console.log('Failed:', errorInfo);
          });
      }}
      onError={() => {
        console.log('Login Failed');
      }}
      useOneTap
    />
  );
};

export default GoogleLoginButton;
