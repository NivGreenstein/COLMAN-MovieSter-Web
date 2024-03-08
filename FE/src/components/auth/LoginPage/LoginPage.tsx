import React from 'react';
import { Button, Form, Input, message } from 'antd';
import GoogleLoginButton from '../GoogleLoginButton/GoogleLoginButton';
import logo from '../../../assets/logo.png'; // Make sure this path is correct
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../../services/auth.service';
import { useSession } from '../../../context/SessionContext';
import { IUser } from '../../../types/IUser';

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setIsLoggedIn, setLoggedUser } = useSession();

  const handleLogin = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          const { email, password } = values;
          const data = await authService.loginUser(email, password);
          setIsLoggedIn(true);
          const user = await authService.getCurrentUserData();
          setLoggedUser(user as IUser);
          console.log('Login success:', data);
          message.success('Login successful!');
          navigate('/movies');
        } catch (error) {
          console.error('Login failed:', error);
          message.error('Login failed. Please check your email and password.');
        }
      })
      .catch((errorInfo) => {
        console.log('Failed:', errorInfo);
      });
  };

  return (
    <div className="login-container" style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
      <Form form={form} layout="vertical" onFinish={handleLogin}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src={logo} alt="App Logo" style={{ maxWidth: '500px', marginBottom: '24px' }} />
        </div>

        <Form.Item
          name="email"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
            {
              pattern: new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
              message: 'Password must contain letters and numbers.',
            },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
        <Form.Item>
          <GoogleLoginButton />
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          Don't have an account?
          <Link to="/register" style={{ marginLeft: '5px' }}>
            Sign up
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
