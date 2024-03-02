import React from 'react';
import { Modal, Rate, Input, Form, Button } from 'antd';

interface AddCommentDialogProps {
  isEditMode: boolean;
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  restartStates: () => void;
  handleSubmit: () => void;
  handleDelete: () => void;
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
  handleDelete,
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
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {isEditMode ? 'Edit Comment' : 'Create Comment'}
            {isEditMode && (
              <Button danger onClick={handleDelete}>
                Delete
              </Button>
            )}
          </div>
        }
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
