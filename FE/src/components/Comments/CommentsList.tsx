import React, { useState } from 'react';
import { Tooltip, List, Rate, Avatar, Button, ConfigProvider, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Comment, CommentFullSchema } from '../../types/IComment';
import { useSession } from '../../context/SessionContext';
import { deleteComment, patchComment } from '../../services/comments.service';
import AddCommentDialog from './AddCommentDialog';
import { CommentThreadModal } from './CommentThreadModal';

interface CommentListProps {
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  isMoviePage: boolean;
  isCommentThread?: boolean;
}

const CommentList: React.FC<CommentListProps> = ({ comments, isMoviePage, setComments, isCommentThread = false }) => {
  const [isAddCommentModalVisible, setIsAddCommentModalVisible] = useState(false);
  const [activeThreadCommentId, setActiveThreadCommentId] = useState<string | null>(null);

  const [commentIdToEdit, setCommentIdToEdit] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const { loggedUser } = useSession();

  const handleDeleteComment = async (commentId: string) => {
    const response = await deleteComment(commentId);
    if (response?.ok) {
      console.log('Comment deleted', response);
      const updatedComments = comments.filter((comment) => comment._id !== commentId);
      setComments(updatedComments);
    }
  };

  const handleEditButtonClick = (commentId: string) => {
    setCommentIdToEdit(commentId);
    const comment = comments.find((comment) => comment._id === commentId);
    if (!comment) throw new Error('No comment found');
    setDescription(comment.description);
    setRating(comment.rating);
    setIsAddCommentModalVisible(true);
  };

  const handleEdit = async () => {
    if (!commentIdToEdit) throw new Error('No comment to edit');

    const commentToUpdate = {
      _id: commentIdToEdit,
      description: description,
      rating: rating,
    };
    CommentFullSchema.partial().parse(commentToUpdate);
    const response = await patchComment(commentToUpdate);
    if (response?.ok) {
      console.log('Comment updated', response);
      const updatedComments = comments.map((comment) =>
        comment._id === commentIdToEdit ? { ...comment, ...commentToUpdate } : comment,
      );
      setComments(updatedComments);
      setIsAddCommentModalVisible(false);
      setCommentIdToEdit('');
    } else {
      console.error('Error updating comment', response);
    }
  };

  return (
    <>
      <div style={{ maxHeight: '60vh', overflowY: 'scroll' }}>
        <List
          className="comment-list"
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={(comment) => (
            <>
              <List.Item
                actions={
                  comment.userId === loggedUser?._id
                    ? [
                        <ConfigProvider
                          theme={{
                            token: {
                              colorPrimary: '#FF8911',
                            },
                          }}
                        >
                          <Button icon={<EditOutlined />} onClick={() => handleEditButtonClick(comment._id)}>
                            Edit
                          </Button>
                        </ConfigProvider>,
                        <ConfigProvider
                          theme={{
                            token: {
                              colorPrimary: '#FE0000',
                            },
                          }}
                        >
                          <Button icon={<DeleteOutlined />} onClick={() => handleDeleteComment(comment._id)}>
                            Delete
                          </Button>
                        </ConfigProvider>,
                      ]
                    : []
                }
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      shape="circle"
                      src={comment.user?.profilePictureUrl ?? comment.movie?.posterUrl}
                      alt={comment.user?.username ?? comment.movie?.title}
                    />
                  }
                  title={isMoviePage ? comment.user?.username : comment.movie?.title}
                  description={
                    <>
                      <Rate disabled value={comment.rating} />
                      <Typography.Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
                        {comment.description}
                      </Typography.Paragraph>
                    </>
                  }
                />
                <Tooltip title={moment(comment.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                  <span>{moment(comment.createdAt).fromNow()}</span>
                </Tooltip>
                {!isCommentThread && (
                  <div>
                    <Button onClick={() => setActiveThreadCommentId(comment._id)}>See thread</Button>
                    <CommentThreadModal
                      isModalVisible={activeThreadCommentId === comment._id}
                      setIsModalVisible={() => setActiveThreadCommentId(null)}
                      comment={comment}
                    />
                  </div>
                )}
              </List.Item>
            </>
          )}
        />
      </div>
      <AddCommentDialog
        isModalVisible={isAddCommentModalVisible}
        setIsModalVisible={setIsAddCommentModalVisible}
        handleSubmit={handleEdit}
        rating={rating}
        setRating={setRating}
        description={description}
        setDescription={setDescription}
        isEditMode={true}
        restartStates={() => {
          setDescription('');
          setRating(0);
        }}
      />
    </>
  );
};

export default CommentList;
