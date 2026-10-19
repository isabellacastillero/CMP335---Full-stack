const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json());

// Validate course data
function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        instructor: Joi.string().min(3).required(),
        credits: Joi.number().integer().min(1).required()
    });

    return schema.validate(course);
}

// Course data
const courses = [
    { id: 1, name: 'course1', instructor: 'Dr. Smith', credits: 3 },
    { id: 2, name: 'course2', instructor: 'Dr. Johnson', credits: 4 },
    { id: 3, name: 'course3', instructor: 'Dr. Brown', credits: 3 },
    { id: 4, name: 'course4', instructor: 'Prof. Davis', credits: 3 },
    { id: 5, name: 'course5', instructor: 'Prof. Wilson', credits: 4 }
];

// Home route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Get all courses
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// Get a course by ID
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) {
        return res.status(404).send(
            'The course with the given ID was not found.'
        );
    }

    res.send(course);
});

// Create a course
app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const course = {
        id: Math.max(0, ...courses.map(c => c.id)) + 1,
        name: req.body.name,
        instructor: req.body.instructor,
        credits: req.body.credits
    };

    courses.push(course);
    res.send(course);
});

// Update a course
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) {
        return res.status(404).send(
            'The course with the given ID was not found.'
        );
    }

    const { error } = validateCourse(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    course.name = req.body.name;
    course.instructor = req.body.instructor;
    course.credits = req.body.credits;

    res.send(course);
});

// Delete a course
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) {
        return res.status(404).send(
            'The course with the given ID was not found.'
        );
    }

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

// Start the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});