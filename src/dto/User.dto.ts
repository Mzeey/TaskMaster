export interface UserPayload{
    signature: string;
    email: string; 
    username: string;
    firstName:string;
    lastName: string;
    userVerified: string;
}

export interface RegisterRequestInputs{
    firstName:string
    lastName: string;
    username: string;
    email: string;
    password: string
}

export interface LoginRequestInputs{
    email: string;
    password: string
}

export interface ChangePasswordRequestInputs{
    oldPassword: string;
    newPassword: string;
}