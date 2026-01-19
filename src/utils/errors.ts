export const errorMessages: Record<string, string> = {
  UNAUTHORIZED: 'Invalid credentials. Please try again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  TOKEN_EXPIRED: 'Your session has expired. Please login again.',
  INVALID_TOKEN: 'Invalid authentication token.',
  EMAIL_NOT_VERIFIED: 'Please verify your email before logging in.',
  USER_NOT_FOUND: 'User not found.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  WEAK_PASSWORD: 'Password is too weak. Please use a stronger password.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

export const getErrorMessage = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  
  if (error?.code && errorMessages[error.code]) {
    return errorMessages[error.code];
  }

  if (error?.status === 401) {
    return errorMessages.UNAUTHORIZED;
  }

  if (error?.status === 403) {
    return errorMessages.FORBIDDEN;
  }

  if (error?.status >= 500) {
    return errorMessages.SERVER_ERROR;
  }

  return 'An unexpected error occurred. Please try again.';
};
