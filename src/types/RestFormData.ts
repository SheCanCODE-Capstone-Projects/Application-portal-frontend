export interface RestFormData {
    token: string;
    newPassword: string;
}

export interface RestFieldErrors {
    token?: string;
    newPassword?: string;
}