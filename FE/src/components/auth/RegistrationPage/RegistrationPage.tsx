import { Button, Form, Input } from 'antd';
import logo from "../../../assets/logo.png";
import React from "react";
import { Link } from 'react-router-dom';



const RegistrationPage: React.FC = () => {
    const [form] = Form.useForm();

    const handleRegistration = () => {
        form
            .validateFields()
            .then((values) => {
                console.log('Success:', values);
            })
            .catch((errorInfo) => {
                console.log('Failed:', errorInfo);
            });
    };

    return (
        <div className="registration-container" style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleRegistration}
            >
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <img src={logo} alt="App Logo" style={{ maxWidth: '500px', marginBottom: '24px' }}/>
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
                    <Input
                        placeholder="Username"
                    />
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
                    <Input
                        placeholder="Email"
                    />
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
                    <Input.Password
                        placeholder="Password"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Register
                    </Button>
                </Form.Item>
                <div style={{ textAlign: 'center' }}>
                    Already have an account?
                        <Link to="/login" style={{ marginLeft: '5px' }}>Log in</Link>
                </div>
            </Form>
        </div>
    );
};

export default RegistrationPage;
