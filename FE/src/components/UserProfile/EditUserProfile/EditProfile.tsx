import React, { useState } from 'react';
import { Form, Input, Button, Avatar, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const EditProfile: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // Assuming you have a way to fetch the current user's data
    // For demonstration, we'll use a static object
    const initialUserData = {
        profileImage: "path_to_profile_image.jpg",
        username: "JohnDoe",
    };

    const [userData, setUserData] = useState(initialUserData);

    const handleSave = async () => {
        // Here you would typically send the updated user data to your backend
        // For demonstration, we'll just show a message
        message.success('Profile updated successfully!');
        navigate('/profile'); // Navigate back to the profile page after saving
    };

    const handleCancel = () => {
        navigate('/profile'); // Navigate back to the profile page
    };

    return (
        <div style={{ background: 'white', margin:  0, minHeight: '80vh', padding: '24px' }}>
            <Form
                form={form}
                initialValues={userData}
                onFinish={handleSave}
                layout="vertical"
            >
                <Form.Item
                    label="Profile Image"
                    name="profileImage"
                    valuePropName="src"
                    rules={[{ required: true, message: 'Please upload your profile image!' }]}
                >
                    <Avatar size={120} shape="circle" icon={<EditOutlined />} />
                </Form.Item>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                    <Button onClick={handleCancel} style={{ marginLeft: '10px' }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditProfile;