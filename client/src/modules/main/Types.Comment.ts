import { MetaDataType } from "../../commons/Types.Common";
import { UserType } from "../auth/Types.Auth";

export type CommentType = {
  _id: string;
  author: UserType;
  comment: string;
  parentId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  replies: CommentType[];
  likeCount: Number;
  dislikeCount: Number;
  userLikes: LikesType[];
}

export type LikesType = {
  author: string;
  comment: string;
  like: Number;
  createdAt: Date;
  updatedAt: Date;
}

export type CommentSortType = 'likes' | 'dislikes';

export type GetCommentListParams = {
  page: number;
  limit: number;
  sortBy?: 'likes' | 'dislikes';
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

export type PostReviewParams = {
  commentId: string;
  like: number;
}

export type PostReviewResponse = {
  ok: boolean;
}