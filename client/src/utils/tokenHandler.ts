import { getAccessToken } from "../configs/localStorage";

export const getHeaderInfo = async function () {
  let token = await getAccessToken();
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  
};