const apiKey = '35e6eeb447c3cee4355a2bff94a45e54';
let currentPage = 1;
let forecastData = [];
let originalForecastData = []; // Added to store original forecast data

document.getElementById('get-weather').addEventListener('click', async () => {
    const city = document.getElementById('city-input').value;

    document.getElementById('error-message')?.remove(); // Remove previous error messages, if any
    if (!city) {
        displayErrorMessage('Please enter a city name.');
        return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            if (response.status === 404) throw new Error('City not found.');
            if (response.status === 429) throw new Error('API limit reached. Please try again later.');
            throw new Error('Something went wrong. Please try again.');
        }

        const data = await response.json();
        const cityForecast = data.list.filter(item => item.dt_txt.includes('12:00:00')); 

        originalForecastData = [...cityForecast.map(item => ({ ...item, city })), ...forecastData];
        forecastData = [...originalForecastData];  // Reset to the original data

        currentPage = 1;  // Reset to first page on new search
        updateForecastTable();
        updatePaginationControls();

    } catch (error) {
        displayErrorMessage(error.message);
    }
});

// Event listener for the filter dropdown
document.getElementById('filter-dropdown').addEventListener('change', (event) => {
    const filterValue = event.target.value;
    applyFilter(filterValue);
});

function applyFilter(filterValue) {
    let filteredData = [...originalForecastData]; // Create a copy to apply filters on

    switch (filterValue) {
        case 'asc':
            filteredData.sort((a, b) => a.main.temp - b.main.temp); // Sort in ascending order by temperature
            break;
        case 'rain':
            filteredData = filteredData.filter(item => item.weather[0].description.includes('rain')); // Filter for rain
            break;
        case 'highest':
            const highestTemp = filteredData.reduce((max, item) => (item.main.temp > max.main.temp ? item : max), filteredData[0]);
            filteredData = [highestTemp]; // Show only the day with the highest temperature
            break;
        case 'desc':
            filteredData.sort((a, b) => b.main.temp - a.main.temp); // Sort in descending order by temperature
            break;
        case 'reset':
            filteredData = [...originalForecastData]; // Reset to original data
            break;
        default:
            filteredData = [...originalForecastData]; // Reset to original data
            break;
    }

    currentPage = 1;
    forecastData = filteredData;
    updateForecastTable();
    updatePaginationControls();
}

function displayErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.classList.add('text-red-500', 'mt-4');
    errorDiv.textContent = message;
    document.querySelector('.flex-1').insertBefore(errorDiv, document.querySelector('.bg-white'));
}

function updateForecastTable() {
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = forecastData.slice(startIndex, endIndex);

    const tableBody = document.getElementById('weatherTableBody');
    tableBody.innerHTML = '';

    paginatedData.forEach(item => {
        const date = new Date(item.dt_txt).toLocaleDateString();
        const temp = item.main.temp;
        const weatherDesc = item.weather[0].description;
        const city = item.city; // City name added to the table

        const row = `
            <tr class="border-b border-gray-200 hover:bg-gray-100">
                <td class="py-3 px-6">${city}</td>
                <td class="py-3 px-6">${date}</td>
                <td class="py-3 px-6">${temp}°C</td>
                <td class="py-3 px-6">${weatherDesc}</td>
            </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

function updatePaginationControls() {
    const totalPages = Math.ceil(forecastData.length / 10);
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const pageNumbersDiv = document.getElementById('pageNumbers');

    // Set the onclick handlers after confirming that buttons exist
    if (prevButton && nextButton && pageNumbersDiv) {
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;

        prevButton.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                updateForecastTable();
                updatePaginationControls();
            }
        };

        nextButton.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                updateForecastTable();
                updatePaginationControls();
            }
        };

        pageNumbersDiv.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageNumberButton = document.createElement('button');
            pageNumberButton.textContent = i;
            pageNumberButton.classList.add('pagination-button', 'mx-1', 'px-3', 'py-2', 'bg-gray-200', 'text-gray-800', 'rounded');

            if (i === currentPage) {
                pageNumberButton.classList.add('bg-gray-600', 'text-white');
            }

            pageNumberButton.addEventListener('click', () => {
                currentPage = i;
                updateForecastTable();
                updatePaginationControls();
            });

            pageNumbersDiv.appendChild(pageNumberButton);
        }
    }
}
