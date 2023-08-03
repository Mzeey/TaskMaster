import nodemailer, { SentMessageInfo } from 'nodemailer';
import { MAIL_HOST, MAIL_PORT, NO_REPLY_EMAIL, NO_REPLY_EMAIL_PASSWORD } from '../config';
import { EmailResponse } from '../dto/Notification.dto';

const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: false,
    auth: {
        user: NO_REPLY_EMAIL,
        pass: NO_REPLY_EMAIL_PASSWORD
    }
});
export const SendMail = async(to: string, subject: string, body: string) => {
    const mailOptions = {
        from: `"No Reply" <${NO_REPLY_EMAIL}>`,
        to: to,
        subject: subject,
        html: body
    };

    const result:EmailResponse = {
        sent: false,
        message: null
    }

    try{
        const info: SentMessageInfo = await transporter.sendMail(mailOptions);
        result.sent = true;
        result.message = `Email Sent: ${info.response}`;
    }catch(error){
        result.message = `Error sending email: ${error}`;
    }

    return result;
}

export const GenerateOTP = () => {
    const OTP_LENGTH = 6;
	const otp = Array.from({ length: OTP_LENGTH }, () => Math.floor(Math.random() * 10)).join('');
	return otp;
}

export const GenerateOTPExpiry = (): Date => {
    let EXPIRY_MINUTES = 15;
	const now = new Date();
	return new Date(now.getTime() + EXPIRY_MINUTES * 60 * 1000);
}

export const OnRequestOTP = async (otp: string, sendEmail: string)=>{
    const Subject = "No Reply: OTP Verification"
    const Body = `Your OTP is: ${otp}`

    const response = await SendMail(sendEmail, Subject, Body);

    return response;
}