export type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
  confirmPassword: string;
};

export type ApiResponse = {
  success: boolean;
  message: string;
  data?: any;
  token?: string;
  user?: {
    id?: string;
    email?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    isVerified?: boolean;
    [key: string]: unknown;
  };
};

class ApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

async function handleResponse<T = any>(response: Response): Promise<T> {
  let body: any;
  try {
    body = await response.json();
  } catch (error) {
    throw new ApiError("Invalid response from server");
  }

  if (!response.ok) {
    throw new ApiError(
      body?.message || "An error occurred",
      response.status,
      body?.code
    );
  }

  return body as T;
}

// Authentication API functions
export async function loginRequest(
  payload: LoginPayload
): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE}/api/v1/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await handleResponse<ApiResponse>(response);
  
  if (data.token) {
    localStorage.setItem("jwt", data.token);
  }

  return data;
}

export async function registerUser(
  payload: RegisterPayload
): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE}/api/v1/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<ApiResponse>(response);
}

export async function verifyEmail(token: string): Promise<ApiResponse> {
  const response = await fetch(
    `${API_BASE}/api/v1/verify-email?token=${encodeURIComponent(token)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse<ApiResponse>(response);
}

export async function forgotPassword(email: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE}/api/v1/password/forgot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return handleResponse<ApiResponse>(response);
}

export async function resetPassword(
  payload: ResetPasswordPayload
): Promise<ApiResponse> {
  const { token, password, confirmPassword } = payload;
  
  const response = await fetch(`${API_BASE}/api/v1/password/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password, confirmPassword }),
  });

  return handleResponse<ApiResponse>(response);
}
