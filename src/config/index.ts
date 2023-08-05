
import {config} from 'dotenv';

let envFileName = "";
if(process.env.NODE_ENV === "production"){
    envFileName = ".env";
}
if(process.env.NODE_ENV === "dev"){
    envFileName = '.env.dev';
}
config({path: envFileName});

export const APP_SECRET = process.env.APP_SECRET || "";
export const MONGODB_URI = process.env.MONGODB_URI || "";
export const NO_REPLY_EMAIL = process.env.NO_REPLY_EMAIL || "";
export const NO_REPLY_EMAIL_PASSWORD = process.env.NO_REPLY_EMAIL_PASSWORD || "";
export const MAIL_HOST:any = process.env.MAIL_HOST;
export const MAIL_PORT:any = process.env.MAIL_PORT;
export const OPEN_WEATHER_MAP_API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;

export const PORT = process.env.PORT || 8000;