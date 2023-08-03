import mongoose,{ Document, Schema } from "mongoose";
import { TodoDoc } from "./Todo";

export interface UserDoc extends Document{
    firstName: string;
    lastName: string;
    username: string;
    email: string
    password: string; 
    salt: string;
    otp: string;
    otp_expiry: string;
    verified: boolean;
    todos: [TodoDoc]
}

const UserSchema = new Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        username: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        salt: {type: String, required: true},
        otp: {type: String, required: true},
        otp_expiry: {type: String, required: true},
        verified: {type: Boolean, default: false},
        todos: [ {type: Schema.Types.ObjectId, ref: 'todo'}]
    },
    {
        toJSON: {
            transform(doc, ret){
                delete ret.__v;
				delete ret.createdAt;
				delete ret.updatedAt;
                delete ret.password;
                delete ret.salt;
			}
        }, 
        timestamps: true
    }
);


const User = mongoose.model<UserDoc>('user', UserSchema);

export {User};