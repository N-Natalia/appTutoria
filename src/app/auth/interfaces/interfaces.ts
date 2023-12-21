export interface AuthResponse {
    user:    LoginUsuario;
    ok:      boolean;
    token:   string;
    message: string;
}

export interface LoginUsuario {
    email:    string;
    password: string;
}

export interface Usuario {
    id:       number;
    code:     string;
    name:     string;
    lastName: string;
    email:    string;
    password: string;
    token:    string;
    role:     string;
}



export interface ResetPassword {
    email:    string;
    emailToken:     string;
    newPassword:     string;
    confirmPassword: string;
}