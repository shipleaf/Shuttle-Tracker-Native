import type { LoginResponse, RegisterResponse } from "@/services/api/auth";

export function login(email: string, _password: string): LoginResponse {
  return {
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    user: { userId: 1, email, name: "홍길동", role: "USER" },
  };
}

export function sendCode(_email: string, _webhookUrl: string): null {
  return null;
}

export function verifyCode(_email: string, _code: string): null {
  return null;
}

export function register(data: {
  email: string;
  password: string;
  name: string;
  studentNumber: string;
}): RegisterResponse {
  return {
    userId: 1,
    email: data.email,
    name: data.name,
    studentNumber: data.studentNumber,
  };
}
