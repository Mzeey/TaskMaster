import { Request } from "express";
import { UserPayload } from "../dto";

export const HandleAuthorization = (req: Request) => {
    const user = <UserPayload>req.user;
    if(!user){
        return {
            user: null,
            message: "Unauthorized User"
        };
    }

    return {
        user: user,
        message: "authorized"
    };
}