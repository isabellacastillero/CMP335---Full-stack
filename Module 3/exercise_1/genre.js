
const express = require('express');
const Joi = require('joi');
const app = express();

app.use(express.json());

const genres = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Comedy' },
    { id: 3, name: 'Drama' }
];

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(genre);
}

// Get all genres
app.get('/api/genres', (req, res) => {
    res.send(genres);
});

// Get one genre
app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));

    if (!genre) {
        return res.status(404).send('The genre with the given ID was not found.');
    }

    res.send(genre);
});

// Create a genre
app.post('/api/genres', (req, res) => {
    const { error } = validateGenre(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const genre = {
        id: Math.max(0, ...genres.map(g => g.id)) + 1,
        name: req.body.name
    };

    genres.push(genre);
    res.send(genre);
});

// Update a genre
app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));

    if (!genre) {
        return res.status(404).send('The genre with the given ID was not found.');
    }

    const { error } = validateGenre(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    genre.name = req.body.name;
    res.send(genre);
});

// Delete a genre
app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));

    if (!genre) {
        return res.status(404).send('The genre with the given ID was not found.');
    }

    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send(genre);
});

const port = process.env.PORT || 3001;
