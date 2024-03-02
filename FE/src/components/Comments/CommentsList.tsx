import React from 'react';
import { Tooltip, List, Rate, Avatar } from 'antd';
import { Comment as AntComment } from '@ant-design/compatible';
import moment from 'moment';
import { Comment } from '../../types/IComment';

interface CommentListProps {
  comments: Comment[];
  isMoviePage: boolean;
}

const CommentList: React.FC<CommentListProps> = ({ comments, isMoviePage }) => {
  return (
    <div style={{ maxHeight: '60vh', overflowY: 'scroll' }}>
      <List
        className="comment-list"
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(comment: Comment) => (
          <li>
            <AntComment
              author={isMoviePage ? comment.user?.username : comment.movie?.title}
              avatar={
                <Avatar
                  shape={isMoviePage ? 'circle' : 'square'}
                  src={isMoviePage ? comment.user?.profilePictureUrl : comment.movie?.posterUrl}
                  alt={isMoviePage ? comment.user?.username : comment.movie?.title}
                />
              }
              content={
                <>
                  <Rate disabled value={comment.rating} />
                  <p>{comment.description}</p>
                </>
              }
              datetime={
                <Tooltip title={moment(comment.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                  <span>{moment(comment.createdAt).fromNow()}</span>
                </Tooltip>
              }
            />
          </li>
        )}
      />
    </div>
  );
};

export default CommentList;
