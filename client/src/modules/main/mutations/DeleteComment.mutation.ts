import {
  UseBaseMutationResult,
  useMutation,
  UseMutationOptions,
} from 'react-query';
import { CommonErrorCodeType } from '../../../commons/Types.Common';
import { DeleteCommentParams, DeleteCommentResponse } from '../Types.Comment';
import { getHeaderInfo } from '../../../utils/tokenHandler';

async function execute(
  params: DeleteCommentParams,
): Promise<DeleteCommentResponse> {
  const headers = getHeaderInfo();
  try {
    return await fetch(`${process.env.REACT_APP_API_HOST}/comment/${params.id}`, {
      method: 'DELETE',
      headers
    });
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
}

export default function useDeleteComment(
  options: UseMutationOptions<
    DeleteCommentResponse,
    CommonErrorCodeType,
    DeleteCommentParams
  >,
): UseBaseMutationResult<
  DeleteCommentResponse,
  CommonErrorCodeType,
  DeleteCommentParams,
  unknown
> {
  return useMutation(
    (params: DeleteCommentParams) =>
      execute(params),
    options,
  );
}
