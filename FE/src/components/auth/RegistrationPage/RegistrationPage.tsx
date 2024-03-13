import { Button, Form, Input, message } from 'antd';
import logo from '../../../assets/logo.png';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../../services/auth.service';

const RegistrationPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleRegistration = () => {
    const defaultProfilePictureUrl = 'http://placekitten.com/200/200';
    form
      .validateFields()
      .then(async (values) => {
        const { username, password, email } = values;

        const payload = {
          username,
          password,
          email,
          profilePictureUrl: defaultProfilePictureUrl,
        };
        try {
          await authService.registerUser(payload);
          message.success('Registration successful!');
          navigate('/login');
        } catch (error) {
          console.error('Registration failed:', error);
          message.error('Registration failed.');
        }
      })
      .catch((errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Please correct the errors in the form.');
      });
  };

  return (
    <div className="registration-container" style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
      <Form form={form} layout="vertical" onFinish={handleRegistration}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src={logo} alt="App Logo" style={{ maxWidth: '500px', marginBottom: '24px' }} />
        </div>

        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input placeholder="Username" />
        </Form.Item>

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
            Register
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          Already have an account?
          <Link to="/login" style={{ marginLeft: '5px' }}>
            Log in
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default RegistrationPage;
