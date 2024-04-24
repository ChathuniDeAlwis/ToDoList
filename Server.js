const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

let tasks = [
    { id: 1, title: "Task 1", completed: false },
    { id: 2, title: "Task 2", completed: true }
];
let nextId = 3;

app.use(bodyParser.json());

// Get all tasks
app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});

// Add a new task
app.post("/api/tasks", (req, res) => {
    const title = req.body.title;
    const newTask = { id: nextId++, title: title, completed: false };
    tasks.push(newTask);
    res.sendStatus(201);
});

// Edit a task
app.put("/api/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const newTitle = req.body.title;
    const task = tasks.find(task => task.id === id);
    if (!task) {
        res.sendStatus(404);
    } else {
        task.title = newTitle;
        res.sendStatus(204);
    }
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== id);
    res.sendStatus(204);
});

// Toggle task completion
app.patch("/api/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (!task) {
        res.sendStatus(404);
    } else {
        task.completed = true;
        res.sendStatus(204);
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
