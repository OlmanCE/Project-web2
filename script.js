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
            //Limpiar la barra de busqueda
            document.getElementById('search-input').value = '';

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

function loadWatchVideoPage() {
    fetch('watch-video.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
        });
}


const BASE_URL = "http://localhost:8000";  // Cambia esto por tu dominio o IP

async function fetchTopVideos() {
    try {
        const response = await fetch(`${BASE_URL}/videos/top/views/`);
        if (!response.ok) {
            throw new Error("Error fetching top videos");
        }

        return await response.json()
    } catch (error) {
        console.error("Error:", error);
    }
}
async function fetchTopRecentFavorites() {
    try {
        const response = await fetch(`${BASE_URL}/videos/top/favorites/`);
        
        if (!response.ok) {
            throw new Error("Error fetching top videos");
        }

        return await response.json()
    } catch (error) {
        console.error("Error:", error);
    }
}
async function fetchSearch(search) {
    try {
        const response = await fetch(`${BASE_URL}/videos/search/?query=${search}`);
        if (!response.ok) {
            throw new Error("Error fetching search");
        }

        return await response.json()
    } catch (error) {
        console.error("Error:", error);
    }
}
async function fetchVideoInfo(id) {
    try {
        const response = await fetch(`${BASE_URL}/videos/${id}`);
        if (!response.ok) {
            throw new Error("Error fetching search");
        }

        return await response.json()
    } catch (error) {
        console.error("Error:", error);
    }
}

async function loadMostViewedVideos() {
    //Consulta al backend
    const mostViewedVideos = await fetchTopVideos()
    const container = document.getElementById('most-viewed');
    //Renderizar los cards
    renderVideos(mostViewedVideos, container, false);
}

async function loadRecentFavorites() {
    //Consulta al backend
    const recentFavorites = await fetchTopRecentFavorites()
    console.log(recentFavorites)
    const container = document.getElementById('recent-favorites'); 
    //Renderizar los cards 
    renderVideos(recentFavorites, container, true);
}

function renderVideos(videos, container, recentFavorites) {
    container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos videos
    videos.forEach(video => {
        let dateFavorite;
        let hourFavorite;
        if (recentFavorites){
            const dateString = video.isFavorite.favoriteDate;
            const cleanDateString = dateString.split('.')[0]; // Elimina los microsegundos
            const date = new Date(cleanDateString);
            dateFavorite = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()
            hourFavorite = date.getHours()+":"+(date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes())
        }

        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = !recentFavorites ? 
            `
                <img src="${BASE_URL}${video.thumbnailPath}" alt="${video.title}">
                <div class="video-info">
                    <div class="video-title">${video.title}</div>
                    <div class="video-description">${video.description}</div>
                    <div class="video-views">${video.viewsCount} visualizaciones</div>
                </div>
            `
        :
            `
                <img src="${BASE_URL}${video.thumbnailPath}" alt="${video.title}">
                <div class="video-info">
                    <div class="video-title">${video.title}</div>
                    <div class="video-description">${video.description}</div>
                    <div class="video-views">${video.viewsCount} visualizaciones</div>
                    <div class="video-favorite-date">Favorito el ${dateFavorite} a las ${hourFavorite}</div>
                </div>
            `;
        videoCard.addEventListener('click', () => loadVideo(video.id));
        container.appendChild(videoCard);
    });
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
            await uploadVideo();
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

async function uploadVideo() {
    const videoFile = document.getElementById('video-file').files[0];
    const videoTitle = document.getElementById('video-title').value;
    const videoDescription = document.getElementById('video-description').value;
    const videoThumbnail = document.getElementById('video-thumbnail').files[0];
    const errorMessage = document.getElementById('error-message');

    const formData = new FormData();
    formData.append('title', videoTitle);
    formData.append('description', videoDescription || "");  // Campo opcional.);
    formData.append('videoFile', videoFile);

    if (videoThumbnail) {
        formData.append('thumbnailFile', videoThumbnail);
    }

    try {
        const response = await fetch(`${BASE_URL}/videos/`, {
            method: 'POST',
            body: formData        
        });

        if (!response.ok) {
            throw new Error('Error al subir el video. Verifica los datos e intenta nuevamente.');
        }

        const result = await response.json();
        console.log('Video subido con éxito:', result);
    } catch (error) {
        throw new Error('Error al conectar con el servidor: ' + error.message);
    }
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

async function performSearch(query) {
    const results = await fetchSearch(query);
    renderSearchResults(results)
}


function renderSearchResults(results) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';
    console.log("LEN: ", results.length)
    results.length > 0 ? 
    (
        results.forEach(video => {
            let videoElement = document.createElement('div');
            videoElement.className = 'search-result-item';
            const creationDate = new Date(video.creationDate).toLocaleDateString();
            videoElement.innerHTML = 
            `
                <img src="${BASE_URL}${video.thumbnailPath}" alt="${video.title}" class="search-result-thumbnail">
                <div class="search-result-info">
                    <h3 class="search-result-title">${video.title}</h3>
                    <p class="search-result-description">${video.description}</p>
                    <div class="search-result-meta">
                        <span>Creado el ${creationDate}</span>
                        <span>${video.viewsCount} visualizaciones</span>
                        <span class="search-result-favorite">${video.isFavorite ? '★ Favorito' : '☆ No favorito'}</span>
                    </div>
                </div>
            `;
            videoElement.addEventListener('click', () => loadVideo(video.id));
            container.appendChild(videoElement);
        })
    )
    :
        console.log("Entro")
        let videoElement = document.createElement('div')
        videoElement.innerHTML = 
            `
                <h3><i>No se encontraron resultados para la busqueda</i></h3>
            `;
        videoElement.className = 'results-not-found'
        container.appendChild(videoElement);
    
}

function setVideoIdToLocalStorage(videoId) {
    localStorage.setItem('selectedVideoId', videoId);
}
function getVideoIdFromLocalStorage() {
    return localStorage.getItem('selectedVideoId');
}

async function loadVideo(videoId) {
    console.log(`Cargando video con ID: ${videoId}`);

    //Limpiar la barra de busqueda
    document.getElementById('search-input').value = '';

    await increment_views(videoId);

    // Guardar el ID del video en localStorage
    setVideoIdToLocalStorage(videoId);

    loadWatchVideoPage();
    loadVideoData(videoId);
}

let isFavorite = false;  // Variable para controlar el estado de favorito

// Función que carga la información del video
async function loadVideoData(videoId) {
    const videoData = await fetchVideoInfo(videoId)
    
    // Asignar el título del video
    document.getElementById('video-title-name').innerText = videoData.title;
    
    // Asignar la descripción del video
    document.getElementById('watch-video-description').innerText = videoData.description;
    
    // Asignar la cantidad de vistas
    document.getElementById('video-views').innerText = `${videoData.viewsCount} visualizaciones`;
    
    // Asignar la fecha de creación
    const creationDate = new Date(videoData.creationDate).toLocaleDateString();
    document.getElementById('video-creation-date').innerText = `Publicado el ${creationDate}`;

    // Asignar el video y la imagen en miniatura
    const videoElement = document.getElementById('video-element');
    videoElement.poster = BASE_URL+videoData.thumbnailPath; // Miniatura
    document.getElementById('video-source').src = BASE_URL+videoData.videoPath; // Video

    const cantidadDeComentarios = videoData.comments.length;
    const countCommentsText = cantidadDeComentarios != 1 ? ' comentarios' : ' comentario';
    document.getElementById('comments-title').innerText = `${cantidadDeComentarios} ${countCommentsText}`;

    // Cargar el video
    videoElement.load();

    // Actualizar el estado del botón de favoritos
    isFavorite = videoData.isFavorite ? true : false;
    updateFavoriteButton();

    // Llenar la lista de comentarios
    loadComments(videoData.comments);
}

// Función para cargar los comentarios
function loadComments(comments) {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';  // Limpiar la lista antes de agregar nuevos elementos

    if (comments.length === 0) {
        commentsList.innerHTML = '<li>No hay comentarios aún. Sé el primero en comentar.</li>';
        return;
    }

    comments.forEach(comment => {
        const listItem = document.createElement('li');

        // Formato de fecha
        const commentDate = new Date(comment.creationDate).toLocaleString();

        // Estructura del comentario con texto y fecha
        listItem.innerHTML = `
            <span class="comment-content">${comment.comment}</span>
            <span class="comment-date">Publicado el: ${commentDate}</span>
        `;

        commentsList.appendChild(listItem);
    });
}

// Función para agregar un nuevo comentario
async function addComment() {
    const newCommentText = document.getElementById('new-comment').value;
    
    if (newCommentText.trim() === '') {
        alert('El comentario no puede estar vacío.');
        return;
    }

    const videoId = getVideoIdFromLocalStorage();
    if (!videoId) {
        console.error('No se encontró el ID del video en la URL.');
        return;
    }
    await fetchAddComment(newCommentText, videoId)

    // Obtener la lista de comentarios
    const commentsList = document.getElementById('comments-list');


    // Si hay un mensaje de "No hay comentarios aún", eliminarlo
    const noCommentsMessage = commentsList.querySelector('li');
    if (noCommentsMessage && noCommentsMessage.textContent.includes('No hay comentarios aún')) {
        commentsList.removeChild(noCommentsMessage);
    }

    const cantidadDeComentarios = commentsList.children.length;
    const countCommentsText = cantidadDeComentarios+1 > 1 ? ' comentarios' : ' comentario';
    document.getElementById('comments-title').innerText = `${cantidadDeComentarios+1} ${countCommentsText}`;

    // Obtener la fecha actual para el nuevo comentario
    const newCommentDate = new Date().toISOString();

    // Crear un nuevo elemento de lista para el comentario
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span class="comment-content">${newCommentText}</span>
        <span class="comment-date">Publicado el: ${new Date(newCommentDate).toLocaleString()}</span>
    `;

    // Agregar el nuevo comentario a la lista
    commentsList.appendChild(listItem);

    // Limpiar el campo de texto después de agregar el comentario
    document.getElementById('new-comment').value = '';

    // Aquí puedes agregar lógica para enviar el comentario a la base de datos
}


// Función para alternar el estado de favorito
function toggleFavorite() {
    isFavorite = !isFavorite;
    updateFavoriteButton();

    const videoId = getVideoIdFromLocalStorage();
    if (!videoId) {
        console.error('No se encontró el ID del video en la URL.');
        return;
    }

    // Aquí debes implementar la lógica para guardar el estado en la base de datos
    if (isFavorite) {
        console.log('El video ha sido marcado como favorito.');
        editFavoriteVideo("POST", videoId)
    } else {
        console.log('El video ha sido eliminado de favoritos.');
        editFavoriteVideo("DELETE", videoId)
    }
}

// Actualizar el texto del botón de favoritos según el estado
function updateFavoriteButton() {
    const favoriteButton = document.getElementById('favorite-button');
    if (isFavorite) {
        favoriteButton.innerText = '☆ Eliminar de Favoritos';
    } else {
        favoriteButton.innerText = '★ Marcar como Favorito';
    }
}

// Función para inicializar el reproductor con los datos obtenidos
function initVideoPlayer(videoData) {
    loadVideoData(videoData);
}

async function editFavoriteVideo(method, id){
    try {
        const response = await fetch(`${BASE_URL}/videos/${id}/favorites`, {
            method:method
        });
        if (!response.ok) {
            throw new Error("Error fetching favorite video");
        }

        return await response.json()
    } catch (error) {
        console.error("Error:", error);
    }
}

async function fetchAddComment(comment, id){
    try {

        const formData = new FormData();
        formData.append('comment', comment);
        console.log({comment})
        const response = await fetch(`${BASE_URL}/videos/${id}/comments/`, {
            method: 'POST',
            body:formData
        });

        if (!response.ok) {
            throw new Error("Error fetching add comment");
        }

        return await response.json()
    } catch (error) {
        console.error("Error:", error);
    }
}

async function increment_views(id){
    try {
        const response = await fetch(`${BASE_URL}/videos/${id}/increment_views`, {
            method:'PUT'
        });
        if (!response.ok) {
            throw new Error("Error fetching favorite video");
        }

        return await response.json()
    } catch (error) {
        console.error("Error:", error);
    }
}