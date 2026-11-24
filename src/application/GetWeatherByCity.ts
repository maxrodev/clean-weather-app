import type { Weather } from "../domain/Weather.ts";
import type { WeatherRepository } from "../domain/WeatherRepository.ts";

export class GetWeatherByCity {

    private readonly weatherRepository: WeatherRepository;

    constructor(weatherRepository: WeatherRepository) {
        this.weatherRepository = weatherRepository;
    }

    async execute(city: string): Promise<Weather | null> {

        const cityTrimmed = city.trim();

        if (cityTrimmed === "") {
            throw new Error("City name cannot be empty");
        }

        return this.weatherRepository.getByCity(cityTrimmed);
    }
}