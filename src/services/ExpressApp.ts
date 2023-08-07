import express, {Application} from 'express';
import { CategoryRoute, TodoRoute, UserRoute, WeatherRoute } from '../routes';

export default async(app: Application) =>{
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));


    app.use('/api/user', UserRoute);
    app.use('/api/categories', CategoryRoute);
    app.use('/api/todos', TodoRoute);
    app.use('/api/weather', WeatherRoute);

    return app;
}