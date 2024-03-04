import React from 'react';
import { Tooltip, List, Rate, Avatar, Button, ConfigProvider, Typography } from 'antd';
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
                    <ConfigProvider
                      theme={{
                        token: {
                          colorPrimary: '#FF8911',
                        },
                      }}
                    >
                      <Button icon={<EditOutlined />} onClick={() => handleEditComment(comment._id)}>
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
          </List.Item>
        )}
      />
    </div>
  );
};

export default CommentList;
