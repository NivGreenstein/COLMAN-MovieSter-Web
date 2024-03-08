import { ObjectId } from 'mongodb';
import {ErrorResponse} from "../Globals";

type CommentCreateSuccessResponse = {
    _id: string | ObjectId;
    imagePath?: string;
};

export type CommentCreateResponse = ErrorResponse | CommentCreateSuccessResponse;