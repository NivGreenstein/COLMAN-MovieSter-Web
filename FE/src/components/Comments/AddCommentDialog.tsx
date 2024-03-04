import React from 'react';
import {Modal, Rate, Input, Form, Button, message, Upload} from 'antd';
import { PlusOutlined } from '@ant-design/icons';


interface AddCommentDialogProps {
    isEditMode: boolean;
    isModalVisible: boolean;
    setIsModalVisible: (value: boolean) => void;
    restartStates: () => void;
    handleSubmit: () => void;
    rating: number;
    setRating: (value: number) => void;
    description: string;
    setDescription: (value: string) => void;
}

const AddCommentDialog: React.FC<AddCommentDialogProps> = ({
                                                               isModalVisible,
                                                               setIsModalVisible,
                                                               restartStates,
                                                               handleSubmit,
                                                               isEditMode = false,
                                                               description,
                                                               rating,
                                                               setDescription,
                                                               setRating,
                                                               image,
                                                               setImage,
                                                           }) => {

    const handleOk = () => {
        handleSubmit();
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        restartStates();
    };

    const beforeUpload = (file) => {
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

    const handleUploadChange = ({fileList}) => {
        const lastFile = fileList.slice(-1)[0];
        if (lastFile && lastFile.originFileObj) {
            setImage(lastFile.originFileObj); // Set the selected image file object
        }
    };

    return (
        <>
            <Modal
                title={isEditMode ? 'Edit Comment' : 'Create Comment'}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form>
                    <Form.Item label="Rating">
                        <Rate value={rating} onChange={setRating}/>
                    </Form.Item>
                    <Form.Item label="Description">
                        <Input.TextArea value={description} onChange={(e) => setDescription(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="Image Upload">
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={handleUploadChange}
                        >
                            {image ? <img src={URL.createObjectURL(image)} alt="avatar" style={{ width: '100%' }} /> : <PlusOutlined />}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AddCommentDialog;
