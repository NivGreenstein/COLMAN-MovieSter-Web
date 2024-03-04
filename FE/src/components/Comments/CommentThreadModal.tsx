import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { Comment } from '../../types/IComment';
import { commentsThread } from '../../services/comments.service';
import CommentList from './CommentsList';
import { AddComment } from './AddComment';

interface CommentThreadModalProps {
  comment: Comment;
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
}

export const CommentThreadModal: React.FC<CommentThreadModalProps> = ({
  comment,
  isModalVisible,
  setIsModalVisible,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!isModalVisible) return;
    fetchComments();
  }, [comment, isModalVisible]);

  const fetchComments = () => {
    commentsThread(comment._id).then((data) => setComments(data));
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        title={'Comment Thread'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={'100%'}
        styles={{ body: { height: '70vh' } }}
        footer={null}
      >
        <AddComment
          isDisabled={false}
          movieId={comment?.movieId}
          fetchComments={fetchComments}
          mainCommentId={comment._id}
        />
        <CommentList comments={comments} isMoviePage={true} isCommentThread={true} setComments={setComments} />
      </Modal>
    </>
  );
};
