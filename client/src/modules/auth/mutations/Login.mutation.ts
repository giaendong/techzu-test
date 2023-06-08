import {
  UseBaseMutationResult,
  useMutation,
  UseMutationOptions,
} from 'react-query';
import { CommonErrorCodeType } from '../../../commons/Types.Common';
import { LoginParams, LoginResponses } from '../Types.Auth';

async function execute(
  params: LoginParams,
): Promise<LoginResponses> {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_HOST}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });
    if (!response.ok) {
      throw new Error('Invalid email or password');
    }
    return response.json();
  } catch (error: unknown) {
    throw error;
  }
}

export default function useLogin(
  options: UseMutationOptions<
    LoginResponses,
    CommonErrorCodeType,
    LoginParams
  >,
): UseBaseMutationResult<
  LoginResponses,
  CommonErrorCodeType,
  LoginParams,
  unknown
> {
  return useMutation(
    (params: LoginParams) =>
      execute(params),
    options,
  );
}
