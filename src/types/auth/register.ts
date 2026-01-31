export type FieldErrors = {
    username?: string;
    email?: string;
    password?: string;
};


export interface RegisterFormData {
    email: string;
    username: string;
    password: string;
}