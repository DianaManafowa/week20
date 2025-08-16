document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetchButton');
    const entityType = document.getElementById('entityType');
    const entityId = document.getElementById('entityId');
    const result = document.getElementById('result');
    const error = document.getElementById('error');
    const loader = document.getElementById('loader');

    fetchButton.addEventListener('click', async () => {
        // Сброс предыдущих результатов
        result.style.display = 'none';
        error.style.display = 'none';
        loader.style.display = 'block';

        try {
            const data = await fetchSWAPI(entityType.value, entityId.value);
            displayResult(data);
        } catch (err) {
            displayError(err);
        } finally {
            loader.style.display = 'none';
        }
    });

    async function fetchSWAPI(type, id) {
        const response = await fetch(`https://swapi.py4e.com/api/${type}/${id}/`);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        return await response.json();
    }

function displayResult(data) {
    let output = '';
    
    if (data.title) {
        // Форматирование для фильмов
        output = `🎬 ${data.title} (Episode ${data.episode_id})
📅 ${data.release_date}
🎥 Director: ${data.director}
📝 Producer: ${data.producer}

${data.opening_crawl}

Characters: ${data.characters.length}
Planets: ${data.planets.length}
Starships: ${data.starships.length}`;
    } else if (data.name) {
        // Форматирование для персонажей, планет и т.д.
        output = `Name: ${data.name}\n`;
        for (const key in data) {
            if (key !== 'name' && !Array.isArray(data[key])) {
                output += `${key}: ${data[key]}\n`;
            }
        }
    }
    
    result.textContent = output || JSON.stringify(data, null, 2);
    result.style.display = 'block';
}

    function displayError(errorObj) {
        let message = '';

        if (errorObj.message.includes('Failed to fetch')) {
            message = '❌ Ошибка сети. Проверьте интернет-соединение.';
        } else if (errorObj.message.includes('HTTP')) {
            message = '⚠️ Сервер вернул ошибку. Возможно, неверный ID.';
        } else {
            message = '⚠️ Неизвестная ошибка: ' + errorObj.message;
        }

        error.textContent = message;
        error.style.display = 'block';
    }
});