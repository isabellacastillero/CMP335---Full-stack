
const movieForm = document.getElementById('movie-form');
const movieList = document.getElementById('movie-list');
const movieCount = document.getElementById('movie-count');
const message = document.getElementById('message');
const formTitle = document.getElementById('form-title');
const submitButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-button');

let editingMovieId = null;

// Display success or error messages
function showMessage(text, isError = false) {
    message.textContent = text;
    message.className = isError ? 'message-error' : 'message-success';
}

// Send requests to the API
async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
    }

    return data;
}

// Create an HTML element safely
function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

// GET: Load all movies
async function loadMovies() {
    movieList.replaceChildren();
    movieCount.textContent = 'Loading movies...';

    try {
        const movies = await apiRequest('/api/movies');

        movieCount.textContent =
            `You have ${movies.length} movie${movies.length === 1 ? '' : 's'} in your collection.`;

        if (movies.length === 0) {
            const emptyMessage = createElement(
                'p',
                'empty-message',
                'Your collection is empty. Add your first movie!'
            );

            movieList.appendChild(emptyMessage);
            return;
        }

        movies.forEach(movie => {
            movieList.appendChild(createMovieCard(movie));
        });
    } catch (error) {
        movieCount.textContent = 'Unable to load movies.';
        showMessage(error.message, true);
    }
}

// Create a card for each movie
function createMovieCard(movie) {
    const card = createElement('article', 'movie-card');
    const title = createElement('h3', '', movie.title);
    const director = createElement('p', '', `Director: ${movie.director}`);
    const year = createElement('p', '', `Year: ${movie.year}`);
    const genre = createElement('p', '', `Genre: ${movie.genre}`);

    const rating = createElement(
        'p',
        'rating',
        `Rating: ${movie.rating.toFixed(1)}/10`
    );

    const watched = createElement(
        'p',
        'watched-status',
        movie.watched ? 'Watched' : 'Not watched yet'
    );

    const actions = createElement('div', 'movie-actions');

    const editButton = createElement('button', 'edit-button', 'Edit');
    editButton.type = 'button';
    editButton.addEventListener('click', () => editMovie(movie));

    const deleteButton = createElement('button', 'delete-button', 'Delete');
    deleteButton.type = 'button';

    deleteButton.addEventListener('click', () => {
        deleteMovie(movie.id, movie.title);
    });

    actions.append(editButton, deleteButton);
    card.append(title, director, year, genre, rating, watched, actions);

    return card;
}

// POST: Add a movie or PUT: Save changes
movieForm.addEventListener('submit', async event => {
    event.preventDefault();

    const movie = {
        title: document.getElementById('title').value.trim(),
        director: document.getElementById('director').value.trim(),
        year: document.getElementById('year').valueAsNumber,
        genre: document.getElementById('genre').value.trim(),
        rating: document.getElementById('rating').valueAsNumber,
        watched: document.getElementById('watched').value === 'true'
    };

    const isEditing = editingMovieId !== null;

    const url = isEditing
        ? `/api/movies/${editingMovieId}`
        : '/api/movies';

    const method = isEditing ? 'PUT' : 'POST';

    submitButton.disabled = true;

    try {
        await apiRequest(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie)
        });

        showMessage(
            isEditing
                ? 'Movie updated successfully!'
                : 'Movie added successfully!'
        );

        resetForm();
        await loadMovies();
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        submitButton.disabled = false;
    }
});

// Fill in the form when editing
function editMovie(movie) {
    editingMovieId = movie.id;

    document.getElementById('title').value = movie.title;
    document.getElementById('director').value = movie.director;
    document.getElementById('year').value = movie.year;
    document.getElementById('genre').value = movie.genre;
    document.getElementById('rating').value = movie.rating;
    document.getElementById('watched').value = String(movie.watched);

    formTitle.textContent = 'Edit Movie';
    submitButton.textContent = 'Save Changes';
    cancelButton.hidden = false;

    showMessage(`Editing "${movie.title}".`);
    document.getElementById('title').focus();
}

// DELETE: Remove a movie
async function deleteMovie(id, title) {
    const confirmed = confirm(
        `Are you sure you want to delete "${title}"?`
    );

    if (!confirmed) {
        return;
    }

    try {
        await apiRequest(`/api/movies/${id}`, {
            method: 'DELETE'
        });

        if (editingMovieId === id) {
            resetForm();
        }

        showMessage(`"${title}" was deleted successfully.`);
        await loadMovies();
    } catch (error) {
        showMessage(error.message, true);
    }
}

// Reset the form to Add Movie mode
function resetForm() {
    movieForm.reset();
    editingMovieId = null;
    formTitle.textContent = 'Add a Movie';
    submitButton.textContent = 'Add Movie';
    cancelButton.hidden = true;
}

// Cancel editing
cancelButton.addEventListener('click', () => {
    resetForm();
    showMessage('Editing cancelled.');
});

// Load movies when the page opens
loadMovies();
