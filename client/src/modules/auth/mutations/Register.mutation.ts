import {
  UseBaseMutationResult,
  useMutation,
  UseMutationOptions,
} from 'react-query';
import { CommonErrorCodeType } from '../../../commons/Types.Common';
import { RegisterParams, RegisterResponses } from '../Types.Auth';

async function execute(
  params: RegisterParams,
): Promise<RegisterResponses> {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_HOST}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });
    return response.json();
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
}

export default function useRegister(
  options: UseMutationOptions<
    RegisterResponses,
    CommonErrorCodeType,
    RegisterParams
  >,
): UseBaseMutationResult<
  RegisterResponses,
  CommonErrorCodeType,
  RegisterParams,
  unknown
> {
  return useMutation(
    (params: RegisterParams) =>
      execute(params),
    options,
  );
}
