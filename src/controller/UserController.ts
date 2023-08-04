import { Request, Response, NextFunction } from "express";
import { LoginRequestInputs, RegisterRequestInputs, UpdateLocaitonRequestInputs, UpdateProfileRequestInputs, UserPayload, VerifyUserRequestInput } from "../dto/User.dto";
import { GenerateSalt, GenerateSignature, HashPassword, ValidatePassword } from "../utilities";
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
    const user = <UserPayload> req.user;
    if(!user){
        return res.status(400).json({message: "Unauthorized User"});
    }
    const profile = await User.findById(user._id);
    if(!profile){
        return res.status(400).json({message: "User not found"});
    }

    const otp = GenerateOTP();
    const otp_expiry = GenerateOTPExpiry();

    profile.otp = otp;
    profile.otp_expiry = otp_expiry.toISOString();

    const mailingResponse = await OnRequestOTP(otp, profile.email);
    if(mailingResponse.sent){
        return res.status(200).json({message: "New OTP sent successfully."});
    }

    return res.status(400).json({message: mailingResponse.message});
    
}

export const Login = async (req: Request, res: Response, next: NextFunction) => {
    const userInputs = <LoginRequestInputs> req.body;
    userInputs.email = userInputs.email.toLowerCase();
    
    const profile = await User.findOne({email: userInputs.email});
    if(!profile){
        return res.status(400).json({message: "Invalid Login Credentials"});
    }

    const validPassword = ValidatePassword(userInputs.password, profile.password, profile.salt);
    if(!validPassword){
        return res.status(400).json({message: "Invalid Login Credentials"});
    }

    const signature = GenerateSignature({
        _id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        username: profile.username,
        userVerified: profile.verified,
        email: profile.email
    });

    if(signature){
        return res.status(200).json({
            signature: signature,
            firstName: profile.firstName,
            lastName: profile.lastName,
            username: profile.username,
            userVerified: profile.verified,
            email: profile.email
        });
    }

    return res.status(400).json({message: "Login Failed"});
};

export const GetProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = <UserPayload>req.user;

    if(!user){
        return res.status(400).json({message: "Unauthorized User"});
    }

    const profile = await User.findById(user._id);
    if(!profile){
        return res.status(400).json({message: "User not found"});
    }

    return res.status(200).json({user: profile});
};

export const UpdateProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = <UserPayload>req.user; 
    if(!user){
        return res.status(400).json({message: "Unauthorized User"}); 
    }

    const profile = await User.findById(user._id);
    if(!profile){
        return res.status(400).json({message: "User not found"});
    }

    const requestData = <UpdateProfileRequestInputs>req.body;
    profile.firstName = requestData.firstName;
    profile.lastName = requestData.lastName;
    profile.username = requestData.username;
    const saved = await profile.save();

    if(!saved){
        return res.status(400).json({message: "Could not update profile"});
    }

    return res.status(200).json({user: profile});
};

export const UpdateLocation = async (req: Request, res: Response, next: NextFunction) =>{
    const user = <UserPayload>req.user; 
    if(!user){
        return res.status(400).json({message: "Unauthorized User"}); 
    }

    const profile = await User.findById(user._id);
    if(!profile){
        return res.status(400).json({message: "User not found"});
    }

    const requestData = <UpdateLocaitonRequestInputs>req.body;
    profile.longitude = requestData.longitude;
    profile.latitude = requestData.latitude;
    const saved = await profile.save();
    if(!saved){
        return res.status(400).json({message: "Could not save user location"});
    }

    return res.status(200).json({user: profile});
}

export const ChangePassword = async (req: Request, res: Response, next: NextFunction) => {};
