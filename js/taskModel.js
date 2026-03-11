import {tasks, saveTasks} from "./state.js";

export function createTaskObject(text) {
    return { id: Date.now(), text, completed: false };
}

export function updateTaskText(task, newText) {
    task.text = newText;
    saveTasks();
}

export function toggleTaskCompleted(task) {
    task.completed = !task.completed;
    saveTasks();
}

export function deleteTaskById(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index > -1) {
        tasks.splice(index, 1);
        saveTasks();
    }
}