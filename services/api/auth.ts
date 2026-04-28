import { MOCK } from '@/config/mock';
import * as authMock from '@/mocks/auth';
import { apiClient } from './client';

export type User = {
  userId: number;
  email: string;
  name: string;
  role: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type RegisterResponse = {
  userId: number;
  email: string;
  name: string;
  studentNumber: string;
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  if (MOCK.auth) return authMock.login(email, password);
  return apiClient.post<LoginResponse>('/auth/login', { email, password });
}

export async function sendMattermostCode(
  email: string,
  mattermostWebhookUrl: string
): Promise<null> {
  if (MOCK.auth) return authMock.sendCode(email, mattermostWebhookUrl);
  return apiClient.post<null>('/auth/register/mattermost/send-code', {
    email,
    mattermostWebhookUrl,
  });
}

export async function verifyMattermostCode(email: string, code: string): Promise<null> {
  if (MOCK.auth) return authMock.verifyCode(email, code);
  return apiClient.post<null>('/auth/register/mattermost/verify', { email, code });
}

export async function register(data: {
  email: string;
  password: string;
  name: string;
  studentNumber: string;
}): Promise<RegisterResponse> {
  if (MOCK.auth) return authMock.register(data);
  return apiClient.post<RegisterResponse>('/auth/register', data);
}

export async function refreshTokens(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  return apiClient.post('/auth/refresh', { refreshToken });
}

export async function logout(token: string): Promise<void> {
  await apiClient.post<null>('/auth/logout', {}, token);
}
