import "./style.css";
import { GetWeatherByCity } from "./application/GetWeatherByCity.ts";
import { OpenMeteoWeatherRepository } from "./infrastructure/OpenMeteoWeatherRepository.ts";
import { WeatherView } from "./presentation/WeatherView.ts";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  const repository = new OpenMeteoWeatherRepository();
  const getWeatherByCity = new GetWeatherByCity(repository);
  const view = new WeatherView(getWeatherByCity, app);

  view.render();
}