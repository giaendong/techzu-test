import {useQuery, QueryObserverResult} from 'react-query';
import { GetCurrentUserResponse } from '../Types.Auth';
import { CommonErrorCodeType } from '../../../commons/Types.Common';
import { getAccessToken, removeTokens } from '../../../configs/localStorage';

export const useGetCurrentUserQueryKey = 'useGetCurrentUserQueryKey';

export function useGetCurrentUserQuery(): QueryObserverResult<GetCurrentUserResponse, CommonErrorCodeType> {
  const accessToken = getAccessToken();
  return useQuery(
    [
      useGetCurrentUserQueryKey,
      accessToken
    ],
    async () => {
      try {
        if (!accessToken) { return; }
        const response = await fetch(`${process.env.REACT_APP_API_HOST}/self`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        });
        if (!response.ok) { removeTokens() }
        return response.json();
      } catch (error: unknown) {
        console.error(error);
      }
    },
    {
      enabled: true,
      refetchOnWindowFocus: false
    },
  );
}
