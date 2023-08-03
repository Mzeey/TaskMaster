import { Request, Response, NextFunction } from "express";
import { RegisterRequestInputs, UserPayload, VerifyUserRequestInput } from "../dto/User.dto";
import { GenerateSalt, GenerateSignature, HashPassword } from "../utilities";
import { GenerateOTP, GenerateOTPExpiry, OnRequestOTP } from "../utilities/NotificationUtility";
import { User } from "../models";

export const RegisterUser = async (req: Request, res: Response, next: NextFunction) => {
	const userInputs = <RegisterRequestInputs>req.body;
	const salt = await GenerateSalt();
	const userPassword = await HashPassword(userInputs.password, salt);

	const otp = GenerateOTP();
	const otpExpiry = GenerateOTPExpiry();

	const existingUser = await User.findOne({ email: userInputs.email.toLowerCase() });
	if (existingUser) {
		return res.status(400).json({ message: "This email is already registered" });
	}

	const createdUser = await User.create({
		firstName: userInputs.firstName,
		lastName: userInputs.lastName,
		username: userInputs.username,
		email: userInputs.email.toLowerCase(),
		password: userPassword,
		salt: salt,
		otp: otp,
		otp_expiry: otpExpiry.toISOString(),
		verified: false,
		todos: [],
	});
	if (!createdUser) {
		return res.status(400).json({ message: "User could not be registered" });
	}
	const mailingResponse = await OnRequestOTP(otp, userInputs.email);

	if (mailingResponse.sent) {
		const payload = <UserPayload>{
			_id: createdUser.id,
			email: createdUser.email,
			firstName: createdUser.firstName,
			lastName: createdUser.lastName,
			userVerified: createdUser.verified,
			username: createdUser.username,
		};

		const signature = GenerateSignature(payload);
		return res.status(200).json({ signature: signature, verified: createdUser.verified });
	}

	await createdUser.deleteOne();
	console.log(mailingResponse);
	return res.status(404).json({ message: mailingResponse.message });
};

export const VerifyUser = async (req: Request, res: Response, next: NextFunction) => {
	const user = <UserPayload>req.user;
	const verificationInputs = <VerifyUserRequestInput>req.body;
	if (!user) {
		return res.status(400).json({ message: "Unauthorized user" });
	}

	const profile = await User.findById(user._id);
	if (!profile) {
		return res.status(400).json({ message: "User deos not exist" });
	}

	if (profile.otp === verificationInputs.otp) {
        const savedExpiryDate = new Date(profile.otp_expiry);
        const currentDate = new Date();

        if(savedExpiryDate < currentDate){
            return res.status(400).json({message: "OTP expired"})
        }

		profile.verified = true;
		const savedUser = await profile.save();
		if (!savedUser) {
            return res.status(400).json({message: "An error occured, could not verify user"})
		}

        const signature = GenerateSignature({
            _id: savedUser.id,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            username: savedUser.username,
            userVerified: savedUser.verified,
            email: savedUser.email
        })

        return res.status(200).json({
            signature: signature,
            email: savedUser.email,
            verified: savedUser.verified
        });
	}

    return res.status(400).json({message: "Invalid OTP Provided"});
};

export const RequestNewOTP = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const Login = async (req: Request, res: Response, next: NextFunction) => {};

export const GetProfile = async (req: Request, res: Response, next: NextFunction) => {};

export const UpdateProfile = async (req: Request, res: Response, next: NextFunction) => {};

export const ChangePassword = async (req: Request, res: Response, next: NextFunction) => {};
