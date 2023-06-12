import { getAccessToken } from "../configs/localStorage";

export const getHeaderInfo = function () {
  let token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
  
};