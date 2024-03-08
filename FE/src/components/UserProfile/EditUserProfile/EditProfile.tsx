import React, {useEffect, useState} from 'react';
import {Avatar, Button, Form, Input, Layout, Upload, message} from 'antd';
import {UserOutlined, SaveOutlined, CloseOutlined, UploadOutlined, EditOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {useSession} from "../../../context/SessionContext";
import {updateUser} from "../../../services/user.service";
import {IUser} from "../../../types/IUser";

const {Content} = Layout;

const EditUserProfile: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const {loggedUser, setLoggedUser} = useSession();
    const [username, setUsername] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string>('');

    useEffect(() => {
        if (loggedUser) {
            setUsername(loggedUser.username);
            setProfileImage(loggedUser.profilePictureUrl);
            form.setFieldsValue({
                username: loggedUser.username,
                profileImage: loggedUser.profilePictureUrl,
            });
        }
    }, [loggedUser, form]);


    const handleSave = async () => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('_id', loggedUser._id);
        formData.append('email', loggedUser.email); // Assuming email is not being changed

        if (profileImage) {
            formData.append('profilePictureUrl', profileImage);
        }

        try {
            await updateUser(loggedUser._id, formData);
            if (loggedUser) {
                const updatedUser: IUser = {
                    ...loggedUser,
                    username: username,
                };
                setLoggedUser(updatedUser);
            }
            message.success('Profile updated successfully!');
            navigate('/profile');
        } catch (error) {
            message.error('Failed to update profile.');
        }
    }

    const handleCancel = () => {
        navigate(-1);
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
            <UploadOutlined style={{zIndex: 1000}}/>
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );

    return (
        <Layout>
            <Content style={{padding: '50px', minHeight: '100vh', minWidth: '100vw'}}>
                <Form layout="vertical" form={form} onFinish={handleSave}>
                    <div style={{textAlign: 'center', marginBottom: '24px'}}>
                        <Upload
                            name="profileImage"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={() => false}
                            onChange={handleImageChange}
                        >
                            {form.getFieldValue('profileImage') ? (
                                <Avatar src={form.getFieldValue('profileImage')} size={120}/>
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                        <Button type="primary" icon={<EditOutlined/>} style={{marginTop: '10px'}}>
                            Edit Image
                        </Button>
                    </div>

                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{required: true, message: 'Please input your username!'}]}
                    >
                        <Input
                            name="username"
                            prefix={<UserOutlined/>}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined/>} style={{marginRight: '8px'}}>
                            Save
                        </Button>
                        <Button onClick={handleCancel} icon={<CloseOutlined/>}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    );
};

export default EditUserProfile;
