import React from 'react';
import { Tooltip, List, Rate } from 'antd';
import { IUserComment, IMovieComment } from '../../types/IComment'; // Assuming this is the correct path
import {Comment as AntComment} from "@ant-design/compatible";
import moment from 'moment';

// Assuming you have defined and exported IUserComment and IMovieComment interfaces correctly in your types file
interface CommentListProps {
    comments: (IUserComment | IMovieComment)[];
    isMoviePage: boolean;
}

const CommentList: React.FC<CommentListProps> = ({ comments, isMoviePage }) => {
    return (
        <List
            className="comment-list"
            header={`${comments.length} ${comments.length > 1 ? 'comments' : 'comment'}`}
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(comment: IUserComment | IMovieComment) => (
                <li>
                    <AntComment
                        author={isMoviePage ? (comment as IMovieComment).username : (comment as IUserComment).movieTitle}
                        content={
                            <>
                                <Rate disabled defaultValue={comment.rating} />
                                <p>{comment.text}</p>
                            </>
                        }
                        datetime={
                            <Tooltip title={moment(comment.date).format('YYYY-MM-DD HH:mm:ss')}>
                                <span>{moment(comment.date).fromNow()}</span>
                            </Tooltip>
                        }
                    />
                </li>
            )}
        />
    );
};

export default CommentList;
