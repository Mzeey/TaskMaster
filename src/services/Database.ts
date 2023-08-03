import mongoose from "mongoose";
import { MONGODB_URI } from "../config";

export default async() => {
    try{
        await mongoose.connect(MONGODB_URI, {});
        console.log("Db Connected Successfully");
    }catch(ex){
        console.log(ex);
    }
}