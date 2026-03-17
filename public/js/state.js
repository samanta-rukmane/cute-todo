export let tasks = [];
export let currentFilter = localStorage.getItem("todoFilter") || "all";

const API_URL = "http://localhost:3000/tasks";


// ---------------------------
// load all tasks from server
export async function loadTasks() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        data.sort((a, b) => a.order - b.order);    // sort tasks by order

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
    localStorage.setItem("todoFilter", newFilter);    // save the selected filter in the browser
}


// ---------------------------
// save order of tasks to server
export async function saveTaskOrder() {
    try {
        for (const task of tasks) {
            await fetch(`${API_URL}/${task.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    text: task.text,
                    completed: task.completed,
                    order: task.order
                })
            });
        }
    } catch (err) {
        console.error("Failed to save order:", err);
    }
}