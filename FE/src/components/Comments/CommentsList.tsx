import React from 'react';
import { Tooltip, List, Rate, Avatar, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Comment } from '../../types/IComment';
import { useSession } from '../../context/SessionContext';

interface CommentListProps {
  comments: Comment[];
  isMoviePage: boolean;
  handleEditComment: (commentId: string) => void;
  handleDeleteComment: (commentId: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, isMoviePage, handleDeleteComment, handleEditComment }) => {
  const { loggedUser } = useSession();
  return (
    <div style={{ maxHeight: '60vh', overflowY: 'scroll' }}>
      <List
        className="comment-list"
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(comment) => (
          <List.Item
            actions={
              comment.userId === loggedUser?._id
                ? [
                    <Button icon={<EditOutlined />} onClick={() => handleEditComment(comment._id)}>
                      Edit
                    </Button>,
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteComment(comment._id)}>
                      Delete
                    </Button>,
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
                  <p>{comment.description}</p>
                </>
              }
            />
            <Tooltip title={moment(comment.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
              <span>{moment(comment.createdAt).fromNow()}</span>
            </Tooltip>
          </List.Item>
        )}
      />
    </div>
  );
};

export default CommentList;
