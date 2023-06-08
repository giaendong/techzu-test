export type UserType = {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export type RegisterParams = {
  email: string;
  password: string;
  username: string;
}

export type RegisterResponses = {
  ok: boolean;
} & UserType;

export type LoginParams = {
  email: string;
  password: string;
}

export type LoginResponses = {
  ok: boolean;
  accessToken: string;
  refreshToken: string;
}

export type GetCurrentUserResponse = {
  ok: boolean;
} & UserType;