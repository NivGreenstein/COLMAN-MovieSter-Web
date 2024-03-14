import React, {useEffect, useState} from 'react';
import {Modal} from 'antd';
import {Comment} from '../../types/IComment';
import {commentsThread} from '../../services/comments.service';
import CommentList from './CommentsList';
import {AddComment} from './AddComment';
import {RcFile} from "antd/es/upload/interface";

interface CommentThreadModalProps {
    comment: Comment;
    isModalVisible: boolean;
    setIsModalVisible: (value: boolean) => void;
    setImage: (value: (RcFile | null)) => void,
    setImagePreview: (value: string) => void,
    imagePreview: string | undefined,
    image?: RcFile | null
}

export const CommentThreadModal: React.FC<CommentThreadModalProps> = ({
                                                                          comment,
                                                                          isModalVisible,
                                                                          setIsModalVisible,
                                                                          imagePreview,
                                                                          setImage,
                                                                          setImagePreview,
                                                                          image = undefined
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
                styles={{body: {height: '70vh'}}}
                footer={null}
            >
                <AddComment
                    isDisabled={false}
                    movieId={comment?.movieId}
                    fetchComments={fetchComments}
                    mainCommentId={comment._id}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    setImage={setImage}
                    image={image}
                    isCommentThread={true}
                />
                <CommentList comments={comments} isMoviePage={true} isCommentThread={true} setComments={setComments}
                             setImagePreview={setImagePreview} imagePreview={imagePreview}/>
            </Modal>
        </>
    );
};
