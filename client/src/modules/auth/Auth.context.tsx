import React, { createContext, ReactNode, useMemo } from 'react';
import { useGetCurrentUserQuery } from './queries';
import { UserType } from './Types.Auth';
import { getAccessToken } from '../../configs/localStorage';

interface IProps {
  children?: ReactNode
}
interface IAuthContext {
  isAuthenticated: boolean;
  initializing: boolean;
  currentUserData: UserType | undefined;
}

const defaultState = {
  isAuthenticated: false,
  initializing: true,
  currentUserData: undefined
};

export const AuthContext = createContext<IAuthContext>(defaultState);

const AuthProvider = ({ children }: IProps) => {
  const currentUserQuery = useGetCurrentUserQuery();
  const token = getAccessToken();
  const currentUserData = useMemo(() => currentUserQuery.data, [currentUserQuery.data]);
  const isAuthenticated = useMemo(() => !!currentUserQuery.data?.id && !!token, [currentUserQuery.data?.id, token]);
  const initializing = useMemo(() => currentUserQuery.isLoading, [currentUserQuery.isLoading]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        initializing,
        currentUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;