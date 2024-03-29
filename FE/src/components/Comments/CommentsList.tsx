import React, {useState} from 'react';
import {Image, Tooltip, List, Rate, Avatar, Button, Typography, ConfigProvider} from 'antd';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import moment from 'moment';
import {Comment, CommentFullSchema} from '../../types/IComment';
import {useSession} from '../../context/SessionContext';
import {deleteComment, patchComment} from '../../services/comments.service';
import AddCommentDialog from './AddCommentDialog';
import {CommentThreadModal} from './CommentThreadModal';
import {RcFile} from 'antd/es/upload/interface';
import {useNavigate} from 'react-router-dom';

interface CommentListProps {
    comments: Comment[];
    setComments: (comments: Comment[]) => void;
    isMoviePage: boolean;
    setImagePreview: (value: string) => void;
    imagePreview: string | undefined;
    isCommentThread?: boolean;
}

const CommentList: React.FC<CommentListProps> = ({
                                                     comments,
                                                     isMoviePage,
                                                     setComments,
                                                     imagePreview,
                                                     setImagePreview,
                                                     isCommentThread = false,
                                                 }) => {
    const navigate = useNavigate();
    const [isAddCommentModalVisible, setIsAddCommentModalVisible] = useState(false);
    const [activeThreadCommentId, setActiveThreadCommentId] = useState<string | null>(null);

    const [commentIdToEdit, setCommentIdToEdit] = useState('');
    const [description, setDescription] = useState('');
    const [rating, setRating] = useState(0);
    const {loggedUser} = useSession();
    const [image, setImage] = useState<RcFile | null>(null);
    const [isDeletedImage, setIsDeletedImage] = useState<boolean>(false);

    const handleDeleteComment = async (commentId: string) => {
        const response = await deleteComment(commentId);
        if (response?.ok) {
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
        if (comment.imagePath) {
            setImagePreview(`${import.meta.env.VITE_API_URI}/${comment.imagePath}`);
        }
    };

    const handleEdit = async () => {
        if (!commentIdToEdit) throw new Error('No comment to edit');

        const currentComment = comments.find(comment => comment._id === commentIdToEdit);
        let currentImage: string | null | undefined = currentComment?.imagePath;
        currentImage = currentImage && !image ? currentImage : undefined;
        if (isDeletedImage) {
            currentImage = undefined
        }
        const commentToUpdate = {
            _id: commentIdToEdit,
            description: description,
            rating: rating,
            imagePath: currentImage
        };
        CommentFullSchema.partial().parse(commentToUpdate);
        try {
            const response = await patchComment(commentToUpdate, image ? (image as File) : undefined);

            const updatedComments = comments.map((comment) =>
                comment._id === commentIdToEdit
                    ? {
                        ...comment,
                        ...commentToUpdate,
                        imagePath: response.imagePath ?? (image ? comment.imagePath : undefined),
                    }
                    : comment,
            );
            setComments(updatedComments);
            setIsAddCommentModalVisible(false);
            setCommentIdToEdit('');
        } catch (error) {
            console.error('Error updating comment', error);
        }
    };

    function getAvatar(comment: Comment) {
        if (isMoviePage) {
            if (comment.user?.isGoogleUser) {
                return comment.user?.profilePictureUrl;
            }
            return `${import.meta.env.VITE_API_URI}/${comment.user?.profilePictureUrl}`;
        }
        return comment.movie?.posterUrl;
    }

    return (
        <>
            <div style={{maxHeight: '60vh', overflowY: 'scroll'}}>
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
                                                        colorPrimaryHover: '#E8751A',
                                                    },
                                                }}
                                            >
                                                <Button icon={<EditOutlined/>}
                                                        onClick={() => handleEditButtonClick(comment._id)}>
                                                    Edit
                                                </Button>
                                            </ConfigProvider>,
                                            <ConfigProvider
                                                theme={{
                                                    token: {
                                                        colorPrimaryHover: '#B80000',
                                                    },
                                                }}
                                            >
                                                <Button icon={<DeleteOutlined/>}
                                                        onClick={() => handleDeleteComment(comment._id)}>
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
                                            onClick={() => {
                                                if (isMoviePage) {
                                                    navigate(`/profile/${comment.user?._id}`);
                                                } else {
                                                    navigate(`/movie/${comment.movieId}`);
                                                }
                                            }}
                                            style={{cursor: 'pointer'}}
                                            shape="circle"
                                            src={getAvatar(comment)}
                                        />
                                    }
                                    title={isMoviePage ? comment.user?.username : comment.movie?.title}
                                    description={
                                        <>
                                            {!isCommentThread && (<Rate disabled value={comment.rating}/>)}
                                            <Typography.Paragraph
                                                ellipsis={{rows: 2, expandable: true, symbol: 'more'}}>
                                                {comment.description}
                                            </Typography.Paragraph>
                                            {comment.imagePath && (
                                                <Image
                                                    width={50}
                                                    src={`${import.meta.env.VITE_API_URI}/${comment.imagePath}`}
                                                    alt="Comment image"
                                                    style={{display: 'block', marginTop: '10px'}}
                                                />
                                            )}
                                        </>
                                    }
                                />
                                <Tooltip title={moment(comment.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                                    <span>{moment(comment.createdAt).fromNow()}</span>
                                </Tooltip>
                                {!isCommentThread && (
                                    <div>
                                        <Button onClick={() => setActiveThreadCommentId(comment._id)}>See
                                            thread</Button>
                                        <CommentThreadModal
                                            isModalVisible={activeThreadCommentId === comment._id}
                                            setIsModalVisible={() => setActiveThreadCommentId(null)}
                                            comment={comment}
                                            setImage={setImage}
                                            setImagePreview={setImagePreview}
                                            imagePreview={imagePreview}
                                            image={image}
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
                setImage={setImage}
                isCommentThread={isCommentThread}
                setIsDeletedImage={setIsDeletedImage}
                setImagePreview={setImagePreview}
                imagePreview={imagePreview}
                restartStates={() => {
                    setDescription('');
                    setRating(0);
                }}
            />
        </>
    );
};

export default CommentList;
