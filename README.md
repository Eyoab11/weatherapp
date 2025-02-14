# weatherapp

A weather forecasting application built with React that uses the OpenWeatherMap API to display current weather conditions. Users can search for weather by location (city or geolocation), and the app provides weather details like temperature, humidity, and weather conditions with corresponding icons.

## Features
- **Search Weather by City:** Users can enter a city name to get the current weather information.
- **Weather Icons & Data:** Displays weather conditions such as Clear, Rain, Snow, Clouds, and more with relevant icons.
- **User-friendly UI:** Clean, responsive design with modern weather visuals.

## Additonal Features
- **Weather Based on Geolocation:** Automatically fetch weather data based on the user's location using the browser's geolocation API.
- **Local Storage:** The app caches weather data for previously searched cities to avoid re-fetching and improve performance.


## Tech Stack
- **React**: For building the user interface and managing application state.
- **OpenWeatherMap API**: Provides real-time weather data.
- **Tailwind CSS**: For styling and responsive design.
- **React Icons**: Used for weather-related icons.

## Installation

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/Eyoab11/weatherapp.git
2. Navigate to the project directory
    ```bash
   cd weatherapp
3. Install dependencies:
   ```bash
   npm install
4. Run the applicaton:
   ```bash
   npm run dev

## Usage
- **Search for a city**: Type the name of a city into the input field and press Enter or click the search button.
- **Get weather based on location**: The app will automatically fetch weather information using your device's geolocation (you can disable this in your browser settings if you prefer).
- **See weather data**: After fetching, the app will display the city name, country, weather conditions, temperature, and humidity.

## API Key
To use the OpenWeatherMap API, you'll need an API key. You can get one by signing up at OpenWeatherMap.
Once you have your API key, replace the placeholder in the Weather_API_Key constant with your actual API key:

  const Weather_API_Key = "enter-your-key-here";
