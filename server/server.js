const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));    // we give the front end

const DATA_PATH = path.join(__dirname, "tasks.json");

function readTasks() {
    if (!fs.existsSync(DATA_PATH)) return [];
    return JSON.parse(fs.readFileSync(DATA_PATH));
}

function saveTasks(tasks) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(tasks, null, 2));
}

// API
app.get("/tasks", (req, res) => res.json(readTasks()));

app.post("/tasks", (req, res) => {
    const tasks = readTasks();
    const task = { id: Date.now(), text: req.body.text, completed: false };
    tasks.push(task);
    saveTasks(tasks);
    res.json(task);
});

app.put("/tasks/:id", (req, res) => {
    const tasks = readTasks();
    const task = tasks.find(t => t.id == req.params.id);
    if (task) {
        task.text = req.body.text ?? task.text;
        task.completed = req.body.completed ?? task.completed;
        saveTasks(tasks);
        res.json(task);
    } else res.status(404).send("Task not found");
});

app.delete("/tasks/:id", (req, res) => {
    let tasks = readTasks();
    tasks = tasks.filter(t => t.id != req.params.id);
    saveTasks(tasks);
    res.sendStatus(204);
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});