import { NextFunction, Request, Response } from "express";
import { User } from "../models";
import { HandleAuthorization } from "../utilities";
import { OPEN_WEATHER_MAP_API_KEY } from "../config";
import axios, {AxiosResponse} from 'axios';
import { API_WeatherForecastResponse, WeatherForecastResponse, WeatherInfo, API_WeatherResponse } from "../dto/weather.dto";

const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

const requestCurrentWeather = async (longitude: number, latitude: number) => {
    const url = `${API_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_MAP_API_KEY}`;
    try{
        const response: AxiosResponse = await axios.get(url);
        return {
            response: response,
            success: true
        };
    }catch(error){
        return{
            response: error,
            success: false
        }
    }
}

const requestWeatherForecast = async (longitude: number, latitude: number) =>{
    const url = `${API_BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_MAP_API_KEY}`
    try{
        const response: AxiosResponse = await axios.get(url);
        return {
            response: response,
            success: true
        };
    }catch(error){
        return{
            response: error,
            success: false
        }
    }
}

export const GetCurrentWeather = async ( req:Request, res: Response, next:NextFunction) =>{
    const {user, message} = HandleAuthorization(req);
    if(user === null){
        return res.status(400).json({message: message});
    }
    
    const profile = await User.findById(user._id);
    if(!profile){
        return res.status(400).json({message: "User not found"});
    }
    
    const weatherResponse = await requestCurrentWeather(profile.longitude, profile.latitude);
    if(!weatherResponse.success){
        return res.status(400).json({message: "Could not get current Weather", error: weatherResponse.response})
    }

    const validResponse = <API_WeatherResponse>weatherResponse.response;
    return res.status(200).json(<WeatherInfo>{
        humidity: validResponse.data.main.humidity,
        temperature: validResponse.data.main.temp,
        weatherIcon: `https://openweathermap.org/img/wn/${validResponse.data.weather[0].icon}@2x.png`
    });
}

export const GetWeatherForcast = async ( req:Request, res: Response, next:NextFunction )=>{
    const {user, message} = HandleAuthorization(req);
    if(user === null){
        return res.status(400).json({message: message});
    }
    
    const profile = await User.findById(user._id);
    if(!profile){
        return res.status(400).json({message: "User not found"});
    }

    const result = await requestWeatherForecast(profile.longitude, profile.latitude)
    if(!result.success){
        return res.status(400).json({message: "Could not get current Weather", error: result.response})
    }

    const validResult = <API_WeatherForecastResponse>result.response;
    const forecasts:any = [];
    validResult.data.list.forEach(item => {
        forecasts.push(<WeatherForecastResponse>{
            date: new Date(item.dt * 1000).toLocaleDateString(),
            temperature:  item.main.temp,
            weatherIcon:`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
        });
    })
    console.log({forecasts});
    return res.status(200).json({forcasts: forecasts});
}