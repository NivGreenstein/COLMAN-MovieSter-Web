import { Button } from 'antd';
import React, { useState } from 'react';
import AddCommentDialog from './AddCommentDialog';
import { CommentBase, CommentSchema } from '../../types/IComment';
import { useSession } from '../../context/SessionContext';
import { createComment } from '../../services/comments.service';

interface AddCommentProps {
  isDisabled: boolean;
  movieId: number;
  mainCommentId?: string | undefined;
  fetchComments: () => void;
}
export const AddComment: React.FC<AddCommentProps> = ({
  isDisabled,
  movieId,
  fetchComments,
  mainCommentId = undefined,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const { loggedUser } = useSession();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const restartAddCommentStates = () => {
    setDescription('');
    setRating(0);
  };

  const handleSubmit = async () => {
    if (!loggedUser) throw new Error('No user logged in');

    const commentToCreate: CommentBase = {
      description: description,
      rating: rating,
      movieId,
      userId: loggedUser._id,
      mainCommentId,
    };
    CommentSchema.parse(commentToCreate);

    const createdComment = await createComment(commentToCreate);

    if (createdComment) {
      console.log('Comment created', createdComment);
      fetchComments();
      // getCommentsByMovieId(`${movieId}`).then((data) => setComments(data ?? []));
      restartAddCommentStates();
      setIsModalVisible(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal} disabled={isDisabled}>
        Create Comment
      </Button>
      <AddCommentDialog
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        handleSubmit={handleSubmit}
        rating={rating}
        setRating={setRating}
        description={description}
        setDescription={setDescription}
        isEditMode={false}
        restartStates={restartAddCommentStates}
      />
    </>
  );
};
