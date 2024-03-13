import { Button } from 'antd';
import React, { useState } from 'react';
import AddCommentDialog from './AddCommentDialog';
import { CommentBase, CommentSchema } from '../../types/IComment';
import { useSession } from '../../context/SessionContext';
import { createComment } from '../../services/comments.service';
import { RcFile } from 'antd/es/upload/interface';

interface AddCommentProps {
  isDisabled: boolean;
  movieId: number;
  mainCommentId?: string | undefined;
  fetchComments: () => void;
  image?: RcFile | null;
  setImage: (value: RcFile | null) => void;
  setImagePreview: (value: string) => void;
  imagePreview: string | undefined;
}

export const AddComment: React.FC<AddCommentProps> = ({
  isDisabled,
  movieId,
  fetchComments,
  mainCommentId = undefined,
  setImagePreview,
  imagePreview,
  setImage,
  image = undefined,
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

    const createdComment = await createComment(commentToCreate, image ? image : undefined);

    if (createdComment) {
      fetchComments();
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
        imagePreview={imagePreview}
        setImage={setImage}
        setImagePreview={setImagePreview}
      />
    </>
  );
};
