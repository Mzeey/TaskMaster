import express, {Application} from 'express';
import { UserRoute } from '../routes';

export default async(app: Application) =>{
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));


    app.use('/api/user', UserRoute);
    // app.use('/todo');
    // app.use('/weather');

    return app;
}