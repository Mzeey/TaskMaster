export interface UserPayload{
    _id: string;
    email: string; 
    username: string;
    firstName:string;
    lastName: string;
    userVerified: boolean;
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

export interface VerifyUserRequestInput{
    otp: string
}