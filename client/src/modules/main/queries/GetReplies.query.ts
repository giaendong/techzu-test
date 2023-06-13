import {useQuery, QueryObserverResult} from 'react-query';
import { CommonErrorCodeType } from '../../../commons/Types.Common';
import { GetRepliesParams, GetRepliesResponse } from '../Types.Comment';
import { getHeaderInfo } from '../../../utils/tokenHandler';

export const useGetRepliesQueryKey = 'useGetRepliesQueryKey';

export function useGetRepliesQuery(params: GetRepliesParams): QueryObserverResult<GetRepliesResponse, CommonErrorCodeType> {
  const headers = getHeaderInfo();
  return useQuery(
    [
      useGetRepliesQueryKey,
      params.parentId
    ],
    async () => {
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/comment/replies?parentId=${params.parentId}`, {
        method: 'GET',
        headers
      });
      return response.json();
    },
    {
      enabled: !!params.parentId,
    },
  );
}
