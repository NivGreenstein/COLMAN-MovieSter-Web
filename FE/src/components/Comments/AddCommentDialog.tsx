import React from 'react';
import { Modal, Rate, Input, Form, Button, message, Upload, Image } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload/interface';
import { UploadChangeParam } from 'antd/lib/upload';

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
  setImage: (value: RcFile | null) => void;
  setImagePreview: (value: string) => void;
  imagePreview: string | undefined;
  disableRatingAndImageUpload?: boolean;
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
  setImage,
  setImagePreview,
  imagePreview,
  disableRatingAndImageUpload = false,
}) => {
  const handleOk = () => {
    handleSubmit();
    setIsModalVisible(false);
    setImagePreview('');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setImagePreview('');
    restartStates();
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

  const handleUploadChange = ({ fileList }: UploadChangeParam) => {
    const lastFile = fileList.slice(-1)[0];
    if (lastFile && lastFile.originFileObj) {
      setImage(lastFile.originFileObj);
      const setPreview = URL.createObjectURL(lastFile.originFileObj);
      setImagePreview(setPreview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview('');
  };

  return (
    <Modal
      title={isEditMode ? 'Edit Comment' : 'Create Comment'}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form>
        {!disableRatingAndImageUpload && (
          <Form.Item label="Rating">
            <Rate value={rating} onChange={setRating} />
          </Form.Item>
        )}
        <Form.Item label="Description">
          <Input.TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Item>
        {!disableRatingAndImageUpload && (
          <Form.Item label="Image Upload">
            {imagePreview ? (
              <div className="image-preview">
                <Image src={`${imagePreview}`} alt="Comment image" style={{ width: '100%' }} />
                <Button
                  icon={<DeleteOutlined />}
                  onClick={handleRemoveImage}
                  style={{ marginTop: '10px' }}
                  disabled={!imagePreview}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <Upload
                name="image"
                listType="picture-card"
                className="image-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleUploadChange}
              >
                <div>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default AddCommentDialog;
