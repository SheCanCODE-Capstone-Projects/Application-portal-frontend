export type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type LoginResponse = {
  token: string;
  user?: {
    role?: string;
    [key: string]: unknown;
  };
  message?: string;
};

class LoginError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "LoginError";
    this.status = status;
    this.code = code;
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export async function loginRequest(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/api/v1/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  let body: any = null;
  try {
    body = await response.json();
  } catch {
  }

  if (!response.ok) {
    const message =
      body?.message ||
      (response.status === 401
        ? "Invalid credentials. Please try again."
        : response.status === 403
        ? "Your account is not verified yet."
        : "Unable to login. Please try again.");

    throw new LoginError(message, response.status, body?.code);
  }

  if (!body?.token) {
    throw new LoginError("Login response missing token.");
  }

  return body as LoginResponse;
}

