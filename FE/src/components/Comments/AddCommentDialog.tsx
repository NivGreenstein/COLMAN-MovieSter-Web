import React from 'react';
import { Modal, Rate, Input, Form } from 'antd';

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
}) => {
  const handleOk = () => {
    handleSubmit();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    restartStates();
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
            <Rate value={rating} onChange={setRating} />
          </Form.Item>
          <Form.Item label="Description">
            <Input.TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddCommentDialog;