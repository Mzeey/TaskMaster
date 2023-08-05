import express from 'express';
import { Authenticate } from '../middleware/Authenticate';
import { GetCurrentWeather, GetWeatherForcast } from '../controller/WeatherController';

const router = express.Router();

router.use(Authenticate);
router.get('/', GetCurrentWeather);
router.get('/forecast', GetWeatherForcast);

export {router as WeatherRoute}