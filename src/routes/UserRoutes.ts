import express from 'express';
import { Authenticate } from '../middleware/Authenticate';
import { ChangePassword, GetProfile, Login, RegisterUser, RequestNewOTP, RequestPasswordReset, ResetPassword, UpdateLocation, UpdateProfile, VerifyUser } from '../controller';
import { Request, Response } from 'express';

const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', Login);
router.post('/request-password-reset', RequestPasswordReset);

router.use(Authenticate)
router.patch('/verify', VerifyUser);
router.get('/verify', RequestNewOTP);
router.get('/profile', GetProfile);
router.patch('/profile', UpdateProfile);
router.patch('/location', UpdateLocation);
router.patch('/change-password', ChangePassword)
router.patch('/reset-password', ResetPassword)

export {router as UserRoute}