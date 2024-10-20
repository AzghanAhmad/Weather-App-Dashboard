const openWeatherApiKey = '35e6eeb447c3cee4355a2bff94a45e54';
const geminiApiKey = 'AIzaSyBtLCfAB40F5ZAFSccHsEu7nrVHsZjtPLI'; 
const MODEL_NAME = "gemini-1.5-flash"; 

const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
const chatAnswerArea = document.getElementById('chatAnswerArea');
const getWeatherBtn = document.getElementById('get-weather');
const cityInput = document.getElementById('city-input');

let fetchedWeatherData = null; // Variable to store fetched weather data

getWeatherBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    // Fetch the weather data and store it in a variable
    fetchedWeatherData = await fetchWeatherData(city);
});

async function fetchWeatherData(city) {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${openWeatherApiKey}`;

    try {
        const response = await fetch(weatherApiUrl);
        if (!response.ok) throw new Error('Weather data not found.');

        const data = await response.json();
        const date = new Date().toLocaleDateString();
        const temp = data.main.temp;
        const weatherDesc = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        // Store the details in an object
        const weatherDetails = {
            city: city,
            date: date,
            temp: temp,
            weatherDesc: weatherDesc,
            humidity: humidity,
            windSpeed: windSpeed
        };

        return weatherDetails; // Return the weather data instead of displaying it
    } 
    catch (error) {
        displayMessage('Error fetching weather data: ' + error.message, 'bot');
        return null; // Return null if there's an error
    }
}

sendChatBtn.addEventListener('click', async () => {
    const query = chatInput.value.trim();
    if (!query) return;

    displayMessage(query, 'user');
    
    if (query.toLowerCase().includes('weather') && fetchedWeatherData) {
        // Use the stored weather data to create a response
        const weatherDetails = fetchedWeatherData; // Get the fetched weather data
        const response = `Weather in ${weatherDetails.city} on ${weatherDetails.date}:
        - Temperature: ${weatherDetails.temp}°C
        - Condition: ${weatherDetails.weatherDesc}
        - Humidity: ${weatherDetails.humidity}%
        - Wind Speed: ${weatherDetails.windSpeed} km/h`;
        
        displayMessage(response, 'bot');
    } 
    else if (query.toLowerCase().includes('weather')) {
        displayMessage('Please fetch the weather data first.', 'bot');
    } 
    else {
        await processGeneralQuery(query);
    }

    chatInput.value = '';
});


function displayMessage(message, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = `${sender.toUpperCase()}: ${message}`;
    chatAnswerArea.appendChild(msgDiv);
    chatAnswerArea.scrollTop = chatAnswerArea.scrollHeight;
}

async function processWeatherQuery(query) {
    const cityMatch = query.match(/weather in (\w+)/i);
    const city = cityMatch ? cityMatch[1] : 'your location';

    const weatherResponse = await fetchWeatherData(city);
}

async function processGeneralQuery(query) {
    const geminiResponse = await GeminiResponse(query);
    displayMessage(geminiResponse, 'bot');
}

async function GeminiResponse(userInput) {
    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: userInput,
                    },
                ],
            },
        ],
    };

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${geminiApiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to fetch response');
        }

        const data = await response.json();

        // If candidates are present, extract and return the response content
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return 'Sorry, I couldn’t process your request.';
        }
    } catch (error) {
        return 'Sorry, I can only answer weather-related queries at the moment.';
    }
}
