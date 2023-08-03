export interface WeatherQueryParams{
    latitude: number;
    longitude: number;
}

export interface WeatherInfo{
    temperature: number;
    condition: string;
    humidity: string;
    windSpeed: number;
}