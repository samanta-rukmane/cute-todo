export let tasks = [];
export let currentFilter = "all";

const API_URL = "http://localhost:3000/tasks";

// ---------------------------
// load all tasks from server
export async function loadTasks() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        tasks.splice(0, tasks.length, ...data); // replace local array
    } catch (err) {
        console.error("Failed to load tasks:", err);
    }
}

// ---------------------------
// add a new task to server
export async function addTaskToServer(text) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });
        const newTask = await res.json();
        tasks.push(newTask);
        return newTask;
    } catch (err) {
        console.error("Failed to add task:", err);
    }
}

// ---------------------------
// update task on server
export async function updateTaskOnServer(task) {
    try {
        await fetch(`${API_URL}/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: task.text, completed: task.completed })
        });
    } catch (err) {
        console.error("Failed to update task:", err);
    }
}

// ---------------------------
// delete task from server
export async function deleteTaskFromServer(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) tasks.splice(index, 1);
    } catch (err) {
        console.error("Failed to delete task:", err);
    }
}

// ---------------------------
// change current filter
export function setFilter(newFilter) {
    currentFilter = newFilter;
}