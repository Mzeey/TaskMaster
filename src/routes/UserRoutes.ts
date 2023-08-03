import express from 'express';
import { Authenticate } from '../middleware/Authenticate';
import { ChangePassword, GetProfile, Login, RegisterUser, UpdateProfile } from '../controller';
import { Request, Response } from 'express';

const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', Login)
router.get('/', (req: Request, res: Response)=>{
    return res.status(200).json({msg: "Hello from User"})
})

router.use(Authenticate)
router.get('/profile', GetProfile);
router.patch('/profile', UpdateProfile);
router.patch('./change-password', ChangePassword)

export {router as UserRoute}