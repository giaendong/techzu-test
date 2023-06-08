export const setTokens = (authRes: any) => {
  localStorage.setItem('accessToken', authRes.accessToken);
  localStorage.setItem('refreshToken', authRes.refreshToken);
};

export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refresh_token');
