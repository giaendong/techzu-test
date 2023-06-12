import {
  UseBaseMutationResult,
  useMutation,
  UseMutationOptions,
} from 'react-query';
import { CommonErrorCodeType } from '../../../commons/Types.Common';
import { PostCommentParams, PostCommentResponse } from '../Types.Comment';
import { getHeaderInfo } from '../../../utils/tokenHandler';

async function execute(
  params: PostCommentParams,
): Promise<PostCommentResponse> {
  const headers = getHeaderInfo();
  try {
    const response = await fetch(`${process.env.REACT_APP_API_HOST}/comment`, {
      method: 'POST',
      body: JSON.stringify(params),
      headers
    });
    return response.json();
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
}

export default function usePostComment(
  options: UseMutationOptions<
    PostCommentResponse,
    CommonErrorCodeType,
    PostCommentParams
  >,
): UseBaseMutationResult<
  PostCommentResponse,
  CommonErrorCodeType,
  PostCommentParams,
  unknown
> {
  return useMutation(
    (params: PostCommentParams) =>
      execute(params),
    options,
  );
}
