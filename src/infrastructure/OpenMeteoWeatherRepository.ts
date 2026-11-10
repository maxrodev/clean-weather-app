import type { Weather } from "../domain/Weather.ts";
import type { WeatherRepository } from "../domain/WeatherRepository.ts";

interface GeocodingResponse {
  results?: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }[];
}

interface WeatherResponse {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
}

const weatherDescriptions: Record<number, string> = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla",
  51: "Llovizna ligera",
  53: "Llovizna",
  55: "Llovizna intensa",
  61: "Lluvia ligera",
  63: "Lluvia",
  65: "Lluvia intensa",
  80: "Chubascos ligeros",
  81: "Chubascos",
  82: "Chubascos intensos",
  95: "Tormenta",
};

export class OpenMeteoWeatherRepository implements WeatherRepository {
  async getByCity(city: string): Promise<Weather | null> {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es`;

    const geocodingResponse = await fetch(geocodingUrl);

    if (!geocodingResponse.ok) {
      throw new Error(
        `Error al consultar geocoding: ${geocodingResponse.statusText}`,
      );
    }

    const geocodingData: GeocodingResponse = await geocodingResponse.json();

    if (!geocodingData.results || geocodingData.results.length === 0) {
      return null;
    }

    const location = geocodingData.results[0];

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&timezone=auto`;

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error(
        `Error al consultar el clima: ${weatherResponse.statusText}`,
      );
    }

    const weatherData: WeatherResponse = await weatherResponse.json();

    return {
      city: location.name,
      country: location.country,
      temperature: weatherData.current_weather.temperature,
      windSpeed: weatherData.current_weather.windspeed,
      description: this.getWeatherDescription(
        weatherData.current_weather.weathercode,
      ),
    };
  }

  private getWeatherDescription(weatherCode: number): string {
    return weatherDescriptions[weatherCode] ?? "Desconocido";
  }
}