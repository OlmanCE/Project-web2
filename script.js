document.addEventListener('DOMContentLoaded', () => {
    loadHomePage();

    document.getElementById('home-link').addEventListener('click', (e) => {
        e.preventDefault();
        loadHomePage();
    });

    document.getElementById('add-video-link').addEventListener('click', (e) => {
        e.preventDefault();
        loadAddVideoPage();
    });
    document.getElementById('search-btn').addEventListener('click', () => {
        const query = document.getElementById('search-input').value.trim();
        if (query) {
            loadSearchResults(query);
        }
    });

    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query) {
                loadSearchResults(query);
            }
        }
    });
});

function loadHomePage() {
    fetch('home.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
            loadMostViewedVideos();
            loadRecentFavorites();
        });
}

function loadAddVideoPage() {
    fetch('add-video.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
            setupAddVideoForm();
        });
}

function loadMostViewedVideos() {
    // Simulación de datos de videos más vistos
    const mostViewedVideos = [
        { id: 1, title: 'Video 1', channel: 'Canal A', thumbnail: 'https://via.placeholder.com/210x118' },
        { id: 2, title: 'Video 2', channel: 'Canal B', thumbnail: 'https://via.placeholder.com/210x118' },
        { id: 3, title: 'Video 3', channel: 'Canal C', thumbnail: 'https://via.placeholder.com/210x118' },
        { id: 4, title: 'Video 4', channel: 'Canal D', thumbnail: 'https://via.placeholder.com/210x118' },
        { id: 5, title: 'Video 5', channel: 'Canal E', thumbnail: 'https://via.placeholder.com/210x118' },
        { id: 6, title: 'Video 6', channel: 'Canal F', thumbnail: 'https://via.placeholder.com/210x118' },
        { id: 7, title: 'Video 7', channel: 'Canal G', thumbnail: 'https://via.placeholder.com/210x118' },
        { id: 8, title: 'Video 8', channel: 'Canal H', thumbnail: 'https://via.placeholder.com/210x118' },
        { id: 9, title: 'Video 9', channel: 'Canal I', thumbnail: 'https://via.placeholder.com/210x118' },
        { id: 10, title: 'Video 10', channel: 'Canal J', thumbnail: 'https://via.placeholder.com/210x118' },
    ];

    const container = document.getElementById('most-viewed');
    renderVideos(mostViewedVideos, container);
}

function loadRecentFavorites() {
    // Simulación de datos de favoritos recientes
    const recentFavorites = [
        { id: 11, title: 'Favorito 1', channel: 'Canal K', thumbnail: 'https://via.placeholder.com/210x118' },
        { id: 12, title: 'Favorito 2', channel: 'Canal L', thumbnail: 'https://via.placeholder.com/210x118' },
        { id: 13, title: 'Favorito 3', channel: 'Canal M', thumbnail: 'https://via.placeholder.com/210x118' },
        { id: 14, title: 'Favorito 4', channel: 'Canal N', thumbnail: 'https://via.placeholder.com/210x118' },
        { id: 15, title: 'Favorito 5', channel: 'Canal O', thumbnail: 'https://via.placeholder.com/210x118' },
        { id: 16, title: 'Favorito 6', channel: 'Canal P', thumbnail: 'https://via.placeholder.com/210x118' },
        { id: 17, title: 'Favorito 7', channel: 'Canal Q', thumbnail: 'https://via.placeholder.com/210x118' },
        { id: 18, title: 'Favorito 8', channel: 'Canal R', thumbnail: 'https://via.placeholder.com/210x118' },
        { id: 19, title: 'Favorito 9', channel: 'Canal S', thumbnail: 'https://via.placeholder.com/210x118' },
        { id: 20, title: 'Favorito 10', channel: 'Canal T', thumbnail: 'https://via.placeholder.com/210x118' },
    ];

    const container = document.getElementById('recent-favorites');
    renderVideos(recentFavorites, container);
}


//---------- Funciones para
function loadSearchResults(query) {
    fetch('search-results.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
            document.getElementById('search-query').textContent = query;
            document.getElementById('search-input').value = query;
            performSearch(query);
        });
}

function performSearch(query) {
    // Simulación de una llamada a la API de búsqueda
    // En el futuro, esto se reemplazará por una llamada real al backend
    setTimeout(() => {
        const results = [
            { id: 1, title: 'Resultado 1', description: 'Descripción del video 1...', thumbnail: 'https://via.placeholder.com/180x101', createdAt: '2023-05-15', views: 1500, isFavorite: true },
            { id: 2, title: 'Resultado 2', description: 'Descripción del video 2...', thumbnail: 'https://via.placeholder.com/180x101', createdAt: '2023-05-14', views: 2300, isFavorite: false },
            { id: 3, title: 'Resultado 3', description: 'Descripción del video 3...', thumbnail: 'https://via.placeholder.com/180x101', createdAt: '2023-05-13', views: 1800, isFavorite: true },
            // ... más resultados simulados
        ];
        renderSearchResults(results);
    }, 500);
}


//----------


function renderVideos(videos, container) {
    container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos videos
    videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}">
            <div class="video-info">
                <div class="video-title">${video.title}</div>
                <div class="video-channel">${video.channel}</div>
            </div>
        `;
        videoCard.addEventListener('click', () => loadVideo(video.id));
        container.appendChild(videoCard);
    });
}

function loadVideo(videoId) {
    // Aquí iría la lógica para cargar la página de reproducción del video
    console.log(`Cargando video con ID: ${videoId}`);
    // En el futuro, esto podría redirigir a una página de reproducción de video
    // o cargar el contenido del video en la página actual
}

function setupAddVideoForm() {
    const form = document.getElementById('add-video-form');
    const uploadStatus = document.getElementById('upload-status');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const returnHomeBtn = document.getElementById('return-home');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        uploadStatus.classList.remove('hidden');
        form.classList.add('hidden');

        try {
            await simulateVideoUpload();
            uploadStatus.classList.add('hidden');
            successMessage.classList.remove('hidden');
        } catch (error) {
            uploadStatus.classList.add('hidden');
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
            form.classList.remove('hidden');
        }
    });

    returnHomeBtn.addEventListener('click', () => {
        loadHomePage();
    });
}

function validateForm() {
    const videoFile = document.getElementById('video-file').files[0];
    const videoTitle = document.getElementById('video-title').value;
    const videoThumbnail = document.getElementById('video-thumbnail').files[0];
    const errorMessage = document.getElementById('error-message');

    if (!videoFile || videoFile.type !== 'video/mp4' || videoFile.size > 10 * 1024 * 1024) {
        errorMessage.textContent = 'Por favor, seleccione un archivo de video MP4 válido (máximo 10MB).';
        errorMessage.classList.remove('hidden');
        return false;
    }

    if (!videoTitle.trim()) {
        errorMessage.textContent = 'Por favor, ingrese un título para el video.';
        errorMessage.classList.remove('hidden');
        return false;
    }

    if (videoThumbnail && (videoThumbnail.type !== 'image/jpeg' || videoThumbnail.size > 2 * 1024 * 1024)) {
        errorMessage.textContent = 'Por favor, seleccione una imagen JPG válida para el thumbnail (máximo 2MB).';
        errorMessage.classList.remove('hidden');
        return false;
    }

    errorMessage.classList.add('hidden');
    return true;
}

function simulateVideoUpload() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = Math.random() > 0.3; // 70% de probabilidad de éxito
            if (success) {
                resolve();
            } else {
                reject(new Error('Error al subir el video. Por favor, intente nuevamente.'));
            }
        }, 3000);
    });
}


// ... (funciones existentes: loadHomePage, loadAddVideoPage, loadMostViewedVideos, loadRecentFavorites, renderVideos, loadVideo, setupAddVideoForm, validateForm, simulateVideoUpload)

function loadSearchResults(query) {
    fetch('search-results.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
            document.getElementById('search-query').textContent = query;
            document.getElementById('search-input').value = query;
            performSearch(query);
        });
}

function performSearch(query) {
    // Simulación de una llamada a la API de búsqueda
    // En el futuro, esto se reemplazará por una llamada real al backend
    setTimeout(() => {
        const results = [
            { id: 1, title: 'Resultado 1', description: 'Descripción del video 1...', thumbnail: 'https://via.placeholder.com/180x101', createdAt: '2023-05-15', views: 1500, isFavorite: true },
            { id: 2, title: 'Resultado 2', description: 'Descripción del video 2...', thumbnail: 'https://via.placeholder.com/180x101', createdAt: '2023-05-14', views: 2300, isFavorite: false },
            { id: 3, title: 'Resultado 3', description: 'Descripción del video 3...', thumbnail: 'https://via.placeholder.com/180x101', createdAt: '2023-05-13', views: 1800, isFavorite: true },
            // ... más resultados simulados
        ];
        renderSearchResults(results);
    }, 500);
}

function renderSearchResults(results) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';

    results.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.className = 'search-result-item';
        videoElement.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}" class="search-result-thumbnail">
            <div class="search-result-info">
                <h3 class="search-result-title">${video.title}</h3>
                <p class="search-result-description">${video.description}</p>
                <div class="search-result-meta">
                    <span>Creado el ${video.createdAt}</span>
                    <span>${video.views} visualizaciones</span>
                    <span class="search-result-favorite">${video.isFavorite ? '★ Favorito' : '☆ No favorito'}</span>
                </div>
            </div>
        `;
        videoElement.addEventListener('click', () => loadVideo(video.id));
        container.appendChild(videoElement);
    });
}

function loadVideo(videoId) {
    // Aquí iría la lógica para cargar la página de reproducción del video
    console.log(`Cargando video con ID: ${videoId}`);
    // En el futuro, esto podría redirigir a una página de reproducción de video
    // o cargar el contenido del video en la página actual
}