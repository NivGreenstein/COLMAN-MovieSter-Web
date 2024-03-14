import React, {useEffect, useState} from 'react';
import {Avatar, Button, Form, Input, Layout, Upload, message, UploadFile} from 'antd';
import {UserOutlined, SaveOutlined, CloseOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {useSession} from '../../../context/SessionContext';
import {getUserById, updateUser} from '../../../services/user.service';
import {IUser} from '../../../types/IUser';
import './editProfile.css';
import {UploadChangeParam} from 'antd/lib/upload';
import {RcFile} from 'antd/es/upload/interface';

const {Content} = Layout;

const EditUserProfile: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const {loggedUser, setLoggedUser} = useSession();
    const [username, setUsername] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string>('');
    const [profileImageFile, setProfileImageFile] = useState<RcFile>();
    const [previewImage, setPreviewImage] = useState<string>('');

    useEffect(() => {
        if (loggedUser) {
            getUserById(loggedUser._id).then((userResponse) => {
                setUsername(userResponse.username);
                setProfileImage(userResponse.profilePictureUrl);
                form.setFieldsValue({
                    username: userResponse.username,
                    profileImage: userResponse.profilePictureUrl,
                });
            });
        }
    }, [loggedUser, form]);

    const handleSave = async () => {
        try {
            const formData = new FormData();
            if (loggedUser) {
                formData.append('_id', loggedUser._id);
                formData.append('email', loggedUser.email);

                formData.append('username', username);

                await updateUser(formData, (profileImageFile as File) ? (profileImageFile as File) : undefined);
                if (loggedUser) {
                    const updatedUser: IUser = {
                        ...loggedUser,
                        username: username,
                        profilePictureUrl: profileImage,
                    };
                    setLoggedUser(updatedUser);
                }
                message.success('Profile updated successfully!');
                navigate('/profile');
            }
        } catch (error) {
            message.error('Failed to update profile.');
        }
    };
    const handleCancel = () => {
        navigate(-1);
    };

    const handleImageChange = ({file}: UploadChangeParam<UploadFile>) => {
        if (file && file.originFileObj) {
            setPreviewImage(URL.createObjectURL(file.originFileObj as Blob));
            setProfileImageFile(file.originFileObj as RcFile);
        } else {
            setProfileImage(URL.createObjectURL(file as unknown as Blob));
        }
    };

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const displayImage: string = previewImage
        ? previewImage
        : loggedUser?.isGoogleUser
            ? profileImage
            : `${import.meta.env.VITE_API_URI}/${profileImage}`;
    const uploadedImage = (
        <div className="image-preview">
            <Avatar src={displayImage} size={120}/>
            <div className="edit-icon-overlay">
                <EditOutlined/>
            </div>
        </div>
    );

    // Upload button displayed when there's no image
    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div>Upload</div>
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
                            beforeUpload={beforeUpload}
                            onChange={handleImageChange}
                            disabled={loggedUser?.isGoogleUser}
                        >
                            {form.getFieldValue('profileImage') ? uploadedImage : uploadButton}
                        </Upload>
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
