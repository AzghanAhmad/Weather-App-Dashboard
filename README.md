
                                                                              ****Weather App****

**Overview**
The Weather App is a web application that allows users to check the weather forecast for a specific city. Users can interact with a chatbot for weather queries, and the app displays detailed weather information in a user-friendly dashboard. It leverages the OpenWeather API to fetch real-time weather data and includes pagination for displaying forecast data.

**Features**
Chatbot Interface: Users can ask about the weather and receive responses from a chatbot.
Weather Data Fetching: Retrieves current weather conditions and forecasts using the OpenWeather API.
Dashboard Display: Shows weather forecasts in a paginated table format.
Unit Conversion: Allows users to toggle between Celsius and Fahrenheit for temperature display.
Filters: Users can filter the displayed forecast by temperature and weather conditions.

**Technologies Used**
HTML
Tailwand CSS (for styling)
JavaScript
OpenWeather API
Fetch API for making HTTP requests

Main Files
chatbot.js: Contains the logic for the chatbot interface, handling user queries, and interacting with the OpenWeather API to fetch weather data.
dashboard.js: Manages the overall dashboard functionality, including fetching and displaying weather data, pagination, and filtering.
table.js: Handles the display of weather data in a table format, allowing for pagination and sorting.
dashboard.html: The HTML structure for the main dashboard, where users can input their city and view weather data.
table.html: The HTML structure for displaying the weather data table.

**How to Run**
1- Clone the repository:
git clone https://github.com/AzghanAhmad/Weather-App-Dashboard.git

2-Navigate to the project directory:
cd Weather-App-Dashboard

Open Dashboard.html in a web browser.

Ensure you have internet access to fetch data from the OpenWeather API.

**Usage**
Fetch Weather: Enter a city name in the input field and click the "Get Weather" button to retrieve the current weather and forecast.
Interact with Chatbot: Type in weather-related queries in the chatbot input field and click "Send Chat" to receive responses.
View Weather Data: The dashboard will display the weather data in a paginated format, allowing users to navigate through multiple pages of forecast information.

**Github Repository Link**
https://github.com/AzghanAhmad/Weather-App-Dashboard.git
