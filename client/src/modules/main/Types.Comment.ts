import { MetaDataType } from "../../commons/Types.Common";
import { UserType } from "../auth/Types.Auth";

export type CommentType = {
  id: string;
  author: UserType;
  comment: string;
  parentId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  replies: CommentType[];
}


export type GetCommentListParams = {
  page: number;
  limit: number;
}

export type GetCommentListResponse = {
  comments: CommentType[];
  metadata: MetaDataType;
}

export type GetRepliesParams = {
  parentId: string;
}

export type GetRepliesResponse = {
  comment: CommentType;
  replies: CommentType[];
  metadata: MetaDataType;
}

export type PostCommentParams = {
  comment: string;
  parentId?: string;
}

export type PostCommentResponse = {
  id: string;
}

export type DeleteCommentParams = {
  id: string;
}

export type DeleteCommentResponse = {
}