import type { GetWeatherByCity } from "../application/GetWeatherByCity.ts";
import type { Weather } from "../domain/Weather.ts";

export class WeatherView {
  private readonly getWeatherByCityUseCase: GetWeatherByCity;
  private readonly container: HTMLElement;

  constructor(
    getWeatherByCityUseCase: GetWeatherByCity,
    container: HTMLElement,
  ) {
    this.getWeatherByCityUseCase = getWeatherByCityUseCase;
    this.container = container;
  }

  render(): void {
    this.container.innerHTML = `
      <main class="weather-app">
        <h1>Clean Weather App</h1>
        <div class="search">
          <input type="text" id="cityInput" placeholder="Escribe una ciudad" />
          <button id="searchButton">Buscar</button>
        </div>
        <div id="weatherInfo" class="weather-info"></div>
      </main>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    const searchButton =
      this.container.querySelector<HTMLButtonElement>("#searchButton");
    const cityInput =
      this.container.querySelector<HTMLInputElement>("#cityInput");
    const weatherInfo =
      this.container.querySelector<HTMLDivElement>("#weatherInfo");

    if (!searchButton || !cityInput || !weatherInfo) {
      return;
    }

    searchButton.addEventListener("click", () => {
      void this.search(cityInput, searchButton, weatherInfo);
    });

    cityInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        void this.search(cityInput, searchButton, weatherInfo);
      }
    });
  }

  private async search(
    cityInput: HTMLInputElement,
    searchButton: HTMLButtonElement,
    weatherInfo: HTMLElement,
  ): Promise<void> {
    searchButton.disabled = true;
    weatherInfo.textContent = "Cargando...";

    try {
      const weather = await this.getWeatherByCityUseCase.execute(
        cityInput.value,
      );

      if (!weather) {
        weatherInfo.textContent = "No se encontró la ciudad";
        return;
      }

      this.renderWeather(weatherInfo, weather);
    } catch (error) {
      weatherInfo.textContent =
        error instanceof Error ? error.message : "Error desconocido";
    } finally {
      // Se ejecuta siempre, incluso con el return o el catch de arriba
      searchButton.disabled = false;
    }
  }

  private renderWeather(target: HTMLElement, weather: Weather): void {
    const card = document.createElement("article");
    card.className = "weather-card";

    // Se usa textContent: los datos de la API nunca se interpretan como HTML
    const city = this.createTextElement(
      "h2",
      "weather-card__city",
      `${weather.city}, ${weather.country}`,
    );
    const temperature = this.createTextElement(
      "p",
      "weather-card__temperature",
      `${weather.temperature}°C`,
    );
    const description = this.createTextElement(
      "p",
      "weather-card__description",
      weather.description,
    );
    const wind = this.createTextElement(
      "p",
      "weather-card__wind",
      `Viento: ${weather.windSpeed} km/h`,
    );

    card.append(city, temperature, description, wind);
    target.replaceChildren(card);
  }

  private createTextElement(
    tag: string,
    className: string,
    text: string,
  ): HTMLElement {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
  }
}