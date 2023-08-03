import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "../dto/Auth.dto";
import { ValidateSignature } from "../utilities";

declare global{
    namespace Express{
        interface Request {
            user?: AuthPayload;
        }
    }
}


export const Authenticate = async (req: Request, res: Response, next: NextFunction) =>{
    const validSignature = await ValidateSignature(req);
    if(!validSignature){
        return res.status(400).json({msg: "Unauthorized user"});
    }
    next();
}