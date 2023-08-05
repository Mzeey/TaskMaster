import express, {Application} from 'express';
import { CategoryRoute, UserRoute, WeatherRoute } from '../routes';

export default async(app: Application) =>{
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));


    app.use('/api/user', UserRoute);
    app.use('/api/categories', CategoryRoute);
    // app.use('/todo');
    app.use('/api/weather', WeatherRoute);

    return app;
}