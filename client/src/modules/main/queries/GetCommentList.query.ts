import {useQuery, QueryObserverResult} from 'react-query';
import { CommonErrorCodeType } from '../../../commons/Types.Common';
import { GetCommentListParams, GetCommentListResponse } from '../Types.Comment';
import { getHeaderInfo } from '../../../utils/tokenHandler';

export const useGetCommentListQueryKey = 'useGetCommentListQueryKey';

export function useGetCommentListQuery(params: GetCommentListParams): QueryObserverResult<GetCommentListResponse, CommonErrorCodeType> {
  const headers = getHeaderInfo();
  return useQuery(
    [
      useGetCommentListQueryKey,
      params.page,
      params.limit
    ],
    async () => {
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/comment?page=${params.page}&limit=${params.limit}`, {
        method: 'GET',
        headers
      });
      return response.json();
    },
    {
      enabled: !!(params.page && params.limit),
      refetchOnWindowFocus: false
    },
  );
}
