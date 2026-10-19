const express = require('express');

const app = express();
app.use(express.json());

let todos = [
    {
        id: 1,
        description: 'Finish homework',
        dueDate: '2026-10-20',
        completed: false
    },
    {
        id: 2,
        description: 'Study for exams',
        dueDate: '2026-10-22',
        completed: false
    }
];

// Validate a to-do item
function validateTodo(todo) {
    if (
        typeof todo.description !== 'string' ||
        todo.description.trim() === ''
    ) {
        return 'Description is required.';
    }

    if (!todo.dueDate) {
        return 'Due date is required.';
    }

    if (typeof todo.completed !== 'boolean') {
        return 'Completed must be true or false.';
    }

    return null;
}

// GET: Home route
app.get('/', (req, res) => {
    res.send('Welcome to the To-do API!');
});

// GET: Retrieve all to-do items
app.get('/api/todos', (req, res) => {
    res.send(todos);
});

// GET: Retrieve one to-do item by ID
app.get('/api/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === Number(req.params.id));

    if (!todo) {
        return res.status(404).send('To-do item not found.');
    }

    res.send(todo);
});

// POST: Create a new to-do item
app.post('/api/todos', (req, res) => {
    const error = validateTodo(req.body);

    if (error) {
        return res.status(400).send(error);
    }

    const todo = {
        id: Math.max(0, ...todos.map(t => t.id)) + 1,
        description: req.body.description.trim(),
        dueDate: req.body.dueDate,
        completed: req.body.completed
    };

    todos.push(todo);
    res.status(201).send(todo);
});

// PUT: Update an existing to-do item
app.put('/api/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === Number(req.params.id));

    if (!todo) {
        return res.status(404).send('To-do item not found.');
    }

    const error = validateTodo(req.body);

    if (error) {
        return res.status(400).send(error);
    }

    todo.description = req.body.description.trim();
    todo.dueDate = req.body.dueDate;
    todo.completed = req.body.completed;

    res.send(todo);
});

// DELETE: Remove a to-do item
app.delete('/api/todos/:id', (req, res) => {
    const index = todos.findIndex(
        t => t.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).send('To-do item not found.');
    }

    const deletedTodo = todos.splice(index, 1)[0];
    res.send(deletedTodo);
});

// Start the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`To-do API running on port ${port}`);
});