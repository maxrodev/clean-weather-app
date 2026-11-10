import type { Weather } from "./Weather.ts";

export interface WeatherRepository {
    // null se devuelve cuando no se encuentra la ciudad
    getByCity(city: string): Promise<Weather | null>;
}