import React, { useState } from 'react';
import { Avatar, Button, Form, Input, Layout, Upload, message } from 'antd';
import {UserOutlined, SaveOutlined, CloseOutlined, UploadOutlined, EditOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const EditUserProfile: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [username, setUsername] = useState<string>('');
    // Assuming you have a method to get the current user's image
    const [profileImage, setProfileImage] = useState<string>('');

    const handleSave = () => {
        message.success('Profile updated successfully!');
        // Here you will include the logic to save the updated user profile
    };

    const handleCancel = () => {
        navigate(-1); // Go back to the previous page
    };

    const handleImageChange = (info: any) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            // Here you will handle the logic to update the state with the new image
            // This is a placeholder for the new image URL
            setProfileImage(URL.createObjectURL(info.file.originFileObj));
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const uploadButton = (
        <div>
            <UploadOutlined style={{zIndex: 1000}} />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <Layout>
            <Content style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
                <Form layout="vertical" form={form} onFinish={handleSave}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={() => false}
                            onChange={handleImageChange}
                        >
                            {profileImage ? <Avatar src={profileImage} size={120} /> : uploadButton}
                        </Upload>
                        <Button type="primary" icon={<EditOutlined />} style={{ marginTop: '10px' }}>
                            Edit Image
                        </Button>
                    </div>

                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} style={{ marginRight: '8px' }}>
                            Save
                        </Button>
                        <Button onClick={handleCancel} icon={<CloseOutlined />}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    );
};

export default EditUserProfile;
