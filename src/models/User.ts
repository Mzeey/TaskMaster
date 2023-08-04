import mongoose,{ Document, Schema } from "mongoose";
import { TodoDoc } from "./Todo";
import { CategoryDoc } from "./Category";

export interface UserDoc extends Document{
    firstName: string;
    lastName: string;
    username: string;
    email: string
    password: string;
    longitude: number;
    latitude: number;
    salt: string;
    otp: string;
    otp_expiry: string;
    verified: boolean;
    todos: [TodoDoc];
    categories: [CategoryDoc];
}

const UserSchema = new Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        username: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        salt: {type: String, required: true},
        longitude: {type: Number},
        latitude: {type: Number},
        otp: {type: String, required: true},
        otp_expiry: {type: String, required: true},
        verified: {type: Boolean, default: false},
        todos: [ {type: Schema.Types.ObjectId, ref: 'todo'}],
        categories: [{type: Schema.Types.ObjectId, ref: 'categories'}]
    },
    {
        toJSON: {
            transform(doc, ret){
                delete ret.__v;
				delete ret.createdAt;
				delete ret.updatedAt;
                delete ret.password;
                delete ret.otp;
                delete ret.otp_expiry;
                delete ret.salt;
			}
        }, 
        timestamps: true
    }
);


const User = mongoose.model<UserDoc>('user', UserSchema);

export {User};