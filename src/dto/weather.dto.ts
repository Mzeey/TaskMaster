export interface WeatherQueryParams{
    latitude: number;
    longitude: number;
}

export interface WeatherInfo{
    temperature: number;
    humidity: number;
    weatherIcon: string
}
export interface WeatherForecastResponse{
    temperature: number;
    date: string;
    weatherIcon: string
}

export interface API_WeatherResponse{
    data:API_WeatherResponseInfo
}

export interface API_WeatherResponseInfo{
    dt:number
    main:{
        temp:number;
        humidity: number
    },
    weather:[{icon: string}]
}

export interface API_WeatherForecastResponse{
    data: {
        list: [API_WeatherResponseInfo]
    }
}