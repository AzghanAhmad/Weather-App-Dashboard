let barChart, doughnutChart, lineChart;

document.getElementById('get-weather').addEventListener('click', async () => {
    const city = document.getElementById('city-input').value;
    const apiKey = '35e6eeb447c3cee4355a2bff94a45e54';

    document.getElementById('error-message').textContent = '';
    document.getElementById('weather-widget').style.display = 'none';

    if (!city) 
    {
        if (barChart) barChart.destroy();
        if (doughnutChart) doughnutChart.destroy();
        if (lineChart) lineChart.destroy();

        document.getElementById('error-message').textContent = 'Please enter a city name.';
        return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            if (response.status === 404) throw new Error('City not found.');
            if (response.status === 429) throw new Error('API limit reached. Please try again later.');
            throw new Error('Something went wrong. Please try again.');
        }

        const data = await response.json();
        

        document.getElementById('weather-widget').style.display = 'block';
        document.getElementById('city-name').textContent = data.name;
        document.getElementById('description').textContent = data.weather[0].description;
        document.getElementById('temperature').textContent = `${data.main.temp}°C`;
        document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
        document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} km/h`;

        const condition = data.weather[0].main.toLowerCase();
        const widget = document.getElementById('weather-widget');
        widget.classList.remove('bg-gray-300', 'bg-blue-300', 'bg-yellow-300');
        if (condition.includes('cloud')) 
        {
            widget.classList.add('bg-gray-300');
        } 
        else if (condition.includes('rain')) {
            widget.classList.add('bg-blue-300');
        }
        
        else 
        {
            widget.classList.add('bg-yellow-300');
        }

        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            throw new Error('Failed to fetch forecast data.');
        }

        const forecastData = await forecastResponse.json();
        updateCharts(forecastData.list);
        displayFiveDayForecast(forecastData.list);
    } 
    catch (error) 
    {
        document.getElementById('error-message').textContent = error.message;
        
        if (barChart) barChart.destroy();
        if (doughnutChart) doughnutChart.destroy();
        if (lineChart) lineChart.destroy();
    }
});

function updateCharts(forecastData) {
    const temps = forecastData.map(item => item.main.temp);
    const dates = forecastData.map(item => new Date(item.dt_txt).toLocaleDateString());

    if (barChart) barChart.destroy();
    if (doughnutChart) doughnutChart.destroy();
    if (lineChart) lineChart.destroy();

    const barCtx = document.getElementById('bar-chart').getContext('2d');
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: 'black'
                    }
                },
                y: {
                    ticks: {
                        color: 'black'
                    }
                }
            }
        }
    });

    const doughnutCtx = document.getElementById('doughnut-chart').getContext('2d');
    const conditions = forecastData.map(item => item.weather[0].main);
    const conditionCounts = conditions.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {});
    doughnutChart = new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(conditionCounts),
            datasets: [{
                data: Object.values(conditionCounts),
                backgroundColor: ['#98FB98', '#00CED1', '#FFA07A']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: 'black'
                    }
                }
            }
        }
    });

    const lineCtx = document.getElementById('line-chart').getContext('2d');
    lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: 'black'
                    }
                },
                y: {
                    ticks: {
                        color: 'black'
                    }
                }
            }
        }
    });
}
function displayFiveDayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; 

    const dailyForecasts = forecastData.filter(item => item.dt_txt.includes('12:00:00'));

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString();
        const temp = day.main.temp;
        const weatherDesc = day.weather[0].description;

        const forecastDiv = document.createElement('div');
        forecastDiv.classList.add('forecast-day', 'p-4', 'bg-white', 'shadow-md', 'rounded-lg');

        forecastDiv.innerHTML = `
            <h3 class="font-bold text-lg">${date}</h3>
            <p>${weatherDesc}</p>
            <p>Temp: ${temp}°C</p>
        `;

        forecastContainer.appendChild(forecastDiv);
    });

    document.getElementById('forecast-widget').style.display = 'block';
}
