
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// Sample movie collection
let movies = [
    {
        id: 1,
        title: 'Interstellar',
        director: 'Christopher Nolan',
        year: 2014,
        genre: 'Sci-Fi',
        rating: 8.7,
        watched: true
    },
    {
        id: 2,
        title: 'The Dark Knight',
        director: 'Christopher Nolan',
        year: 2008,
        genre: 'Action',
        rating: 9.0,
        watched: true
    },
    {
        id: 3,
        title: 'Coco',
        director: 'Lee Unkrich',
        year: 2017,
        genre: 'Animation',
        rating: 8.4,
        watched: false
    }
];

// Validate movie information
function validateMovie(movie) {
    if (typeof movie.title !== 'string' || !movie.title.trim()) {
        return 'A valid movie title is required.';
    }

    if (typeof movie.director !== 'string' || !movie.director.trim()) {
        return 'A valid director is required.';
    }

    if (
        !Number.isInteger(movie.year) ||
        movie.year < 1888 ||
        movie.year > new Date().getFullYear()
    ) {
        return 'Enter a valid release year.';
    }

    if (typeof movie.genre !== 'string' || !movie.genre.trim()) {
        return 'A valid genre is required.';
    }

    if (
        typeof movie.rating !== 'number' ||
        !Number.isFinite(movie.rating) ||
        movie.rating < 0 ||
        movie.rating > 10
    ) {
        return 'Rating must be a number between 0 and 10.';
    }

    if (typeof movie.watched !== 'boolean') {
        return 'Watched must be true or false.';
    }

    return null;
}

// GET: Retrieve all movies
app.get('/api/movies', (req, res) => {
    res.status(200).json(movies);
});

// GET: Retrieve one movie by ID
app.get('/api/movies/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            error: 'Movie ID must be a positive integer.'
        });
    }

    const movie = movies.find(movie => movie.id === id);

    if (!movie) {
        return res.status(404).json({
            error: 'Movie not found.'
        });
    }

    res.status(200).json(movie);
});

// POST: Add a new movie
app.post('/api/movies', (req, res) => {
    const error = validateMovie(req.body);

    if (error) {
        return res.status(400).json({ error });
    }

    const newMovie = {
        id: movies.length > 0
            ? Math.max(...movies.map(movie => movie.id)) + 1
            : 1,
        title: req.body.title.trim(),
        director: req.body.director.trim(),
        year: req.body.year,
        genre: req.body.genre.trim(),
        rating: req.body.rating,
        watched: req.body.watched
    };

    movies.push(newMovie);

    res.status(201).json(newMovie);
});

// PUT: Update an existing movie
app.put('/api/movies/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            error: 'Movie ID must be a positive integer.'
        });
    }

    const movie = movies.find(movie => movie.id === id);

    if (!movie) {
        return res.status(404).json({
            error: 'Movie not found.'
        });
    }

    const error = validateMovie(req.body);

    if (error) {
        return res.status(400).json({ error });
    }

    movie.title = req.body.title.trim();
    movie.director = req.body.director.trim();
    movie.year = req.body.year;
    movie.genre = req.body.genre.trim();
    movie.rating = req.body.rating;
    movie.watched = req.body.watched;

    res.status(200).json(movie);
});

// DELETE: Remove a movie
app.delete('/api/movies/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            error: 'Movie ID must be a positive integer.'
        });
    }

    const index = movies.findIndex(movie => movie.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: 'Movie not found.'
        });
    }

    const deletedMovie = movies.splice(index, 1)[0];

    res.status(200).json({
        message: 'Movie deleted successfully.',
        movie: deletedMovie
    });
});

// Start the server
app.listen(port, () => {
    console.log(
        `Movie Collection Manager running at http://localhost:${port}`
    );
});
