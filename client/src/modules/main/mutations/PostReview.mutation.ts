import {
  UseBaseMutationResult,
  useMutation,
  UseMutationOptions,
} from 'react-query';
import { CommonErrorCodeType } from '../../../commons/Types.Common';
import { PostReviewParams, PostReviewResponse } from '../Types.Comment';
import { getHeaderInfo } from '../../../utils/tokenHandler';

async function execute(
  params: PostReviewParams,
): Promise<PostReviewResponse> {
  const headers = getHeaderInfo();
  try {
    const response = await fetch(`${process.env.REACT_APP_API_HOST}/review`, {
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

export default function usePostReview(
  options: UseMutationOptions<
    PostReviewResponse,
    CommonErrorCodeType,
    PostReviewParams
  >,
): UseBaseMutationResult<
  PostReviewResponse,
  CommonErrorCodeType,
  PostReviewParams,
  unknown
> {
  return useMutation(
    (params: PostReviewParams) =>
      execute(params),
    options,
  );
}
