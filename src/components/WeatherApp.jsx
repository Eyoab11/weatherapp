import React, { useRef, useState, useEffect } from 'react';
import { FaSearch, FaThermometerThreeQuarters, FaWater } from 'react-icons/fa';
import weatherPhoto from '../assets/midnightinthevalley-mobile_png by Cagri Yurtbasi.jpg';

// Store your OpenWeatherMap API key here for easy reference
const Weather_API_Key = "5c86490ff1685b81ccc2dcc182a48a32";

const WeatherApp = () => {
  const inputRef = useRef(null); // This will give us access to the input field where the user types the city name
  const [apiData, setApiData] = useState(null); // This will store the weather data we get from the API
  const [showWeather, setShowWeather] = useState(null); // This will store the weather type for displaying the right icon and image
  const [loading, setLoading] = useState(false); // A loading state to show a spinner when data is being fetched
  const [error, setError] = useState(""); // To handle any error messages

  // List of weather types and their corresponding icons for easy matching
  const WeatherTypes = [
    { type: "Clear", img: "https://cdn-icons-png.flaticon.com/512/6974/6974833.png" },
    { type: "Rain", img: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png" },
    { type: "Snow", img: "https://cdn-icons-png.flaticon.com/512/642/642102.png" },
    { type: "Clouds", img: "https://cdn-icons-png.flaticon.com/512/414/414825.png" },
    { type: "Haze", img: "https://cdn-icons-png.flaticon.com/512/1197/1197102.png" },
    { type: "Smoke", img: "https://cdn-icons-png.flaticon.com/512/4380/4380458.png" },
    { type: "Mist", img: "https://cdn-icons-png.flaticon.com/512/4005/4005901.png" },
    { type: "Drizzle", img: "https://cdn-icons-png.flaticon.com/512/3076/3076129.png" },
  ];

  // Function to fetch weather data when the Enter key is pressed in the input field
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchWeather(); // Call the fetchWeather function when Enter is pressed
    }
  };

  // Function to fetch weather data from OpenWeatherMap API based on the city entered
  const fetchWeather = async () => {
      const city = inputRef.current.value; // Get the city name typed by the user
      if (!city) {
          setError("Please enter a location."); // Show an error if the user doesn't enter anything
          return;
      }

      // Check if the weather data for this city is already cached in local storage
      const cachedData = localStorage.getItem(city);
      if (cachedData) {
          // If data is cached, use it directly and display it
          setApiData(JSON.parse(cachedData)); // Parse the cached data
          setShowWeather(WeatherTypes.filter(weather => weather.type === JSON.parse(cachedData).weather[0].main)); // Get the correct weather icon for the cached data
          setError(""); // Clear any previous error
          return;
      }

      // API URL to fetch weather data based on the city
      const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${Weather_API_Key}`;
      setLoading(true); // Set loading to true while fetching data
      setError("");  // Reset any previous errors
      try {
          const res = await fetch(URL); // Make the API request
          const data = await res.json(); // Parse the JSON response

          // Handle errors such as city not being found
          if (data.cod === "404" || data.cod === "400") {
              // Show a 404 error image and message if the city is not found
              setShowWeather([{ type: 'Not Found', img: "https://previews.123rf.com/images/vectorstockcompany/vectorstockcompany1809/vectorstockcompany180901621/109719685-of-404-error-page-or-file-not-found-icon-symbol-of-page-with-flag-404-on-laptop-display-concept.jpg" }]);
              setApiData(null);
              setError("City not found. Please try a different location.");
          } else {
              // Store the weather data in local storage for future use
              localStorage.setItem(city, JSON.stringify(data));
              setShowWeather(WeatherTypes.filter(weather => weather.type === data.weather[0].main)); // Show the correct weather icon
              setApiData(data); // Store the fetched data
              setError(""); // Clear any error messages
          }
      } catch (err) {
          // Catch any errors during the fetch process (network issues, etc.)
          console.error(err);
          setError("Failed to fetch weather data. Please try again later.");
      } finally {
          setLoading(false); // Set loading to false once the fetch is done
      }
  };

  // Function to fetch weather based on the user's current location using geolocation
  const fetchWeatherByGeolocation = async () => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
              const { latitude, longitude } = position.coords;
              const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${Weather_API_Key}`;
              setLoading(true); // Set loading to true while fetching data
              setError("");
              try {
                  const res = await fetch(URL);
                  const data = await res.json();
                  if (data.cod === "404" || data.cod === "400") {
                      setShowWeather([{ type: 'Not Found', img: "https://previews.123rf.com/images/vectorstockcompany/vectorstockcompany1809/vectorstockcompany180901621/109719685-of-404-error-page-or-file-not-found-icon-symbol-of-page-with-flag-404-on-laptop-display-concept.jpg" }]);
                      setApiData(null);
                      setError("Location not found.");
                  } else {
                      setShowWeather(WeatherTypes.filter(weather => weather.type === data.weather[0].main)); // Get the correct weather icon
                      setApiData(data); // Store the fetched data
                      setError("");
                  }
              } catch (err) {
                  console.error(err);
                  setError("Failed to fetch weather data. Please try again later.");
              } finally {
                  setLoading(false); // Stop the loading spinner once the fetch is done
              }
          });
      } else {
          setError("Geolocation is not supported by this browser."); // Handle case where geolocation is not available
      }
  };

  // Automatically fetch weather data based on user's geolocation when the page loads
  useEffect(() => {
    fetchWeatherByGeolocation();
  }, []);

  return (
      <div className="bg-gray-700 h-screen grid place-items-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${weatherPhoto})` }}>
          {/* Main heading */}
          <h1 className="text-4xl text-white font-bold transition-transform duration-500 transform hover:scale-110">
              Weather Wizard
          </h1>
          {/* Weather input section */}
          <div className="bg-white w-96 p-4 rounded-lg -mt-60 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                  {/* Input field for city name */}
                  <input
                      type="text"
                      placeholder="Enter location"
                      ref={inputRef} // Reference to input field
                      onKeyPress={handleKeyPress} // Trigger weather fetch when Enter is pressed
                      className="text-xl border-b p-1 w-full border-gray-200 font-semibold uppercase text-black placeholder-black focus:outline-none transition-transform duration-300"
                  />
                  {/* Search button */}
                  <button
                      onClick={fetchWeather} // Fetch weather data when button is clicked
                      className="ml-2 text-2xl text-blue-600 hover:text-blue-800 transition-all duration-300 transform active:scale-90">
                      <FaSearch />
                  </button>
              </div>
              {/* Display error message if any */}
              {error && <p className="text-red-600 text-center mb-4">{error}</p>}
              {/* Weather details section */}
              <div className={`duration-300 delay-75 overflow-hidden ${showWeather ? 'h-[27rem]' : 'h-0'}`}>
                  {loading ? (
                      <div className="grid place-items-center h-full">
                          <img src="https://cdn-icons-png.flaticon.com/512/1477/1477009.png" alt="Loading..." className="w-14 mx-auto mb-2 animate-spin" />
                      </div>
                  ) : (
                      showWeather && (
                          <div className="text-center flex flex-col gap-6 mt-10 transition-opacity duration-700 ease-in-out opacity-100">
                              {apiData && (
                                  <p className="text-xl font-semibold">
                                      {apiData.name + ', ' + apiData.sys.country} {/* Display the city and country */}
                                  </p>
                              )}
                              {/* Weather type icon */}
                              <img src={showWeather[0]?.img} alt="Weather Icon" className="w-52 mx-auto transition-all duration-500 transform hover:scale-125" />
                              {/* Weather type */}
                              <h3 className="text-4xl font-bold text-zinc-800">{showWeather[0]?.type}</h3>
                              {apiData && (
                                  <div className="flex justify-around transition-transform duration-500 hover:scale-110">
                                      <FaThermometerThreeQuarters className="h-9 mt-1" />
                                      <h2 className="text-4xl font-extrabold mr-6">
                                          {apiData.main.temp}&#176;C {/* Display temperature */}
                                      </h2>
                                      <FaWater className="h-9 mt-1 text-2xl" />
                                      <h2 className="text-4xl font-extrabold">
                                          {apiData.main.humidity}% {/* Display humidity */}
                                      </h2>
                                  </div>
                              )}
                          </div>
                      )
                  )}
              </div>
          </div>
      </div>
  );
};

export default WeatherApp;
