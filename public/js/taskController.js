import { tasks, currentFilter, setFilter, addTaskToServer, updateTaskOnServer, deleteTaskFromServer } from "./state.js";
import { renderTasks, updateClearButton } from "./taskView.js";

const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const filterButtons = document.querySelectorAll(".filters button");
const list = document.getElementById("taskList");
const clearBtn = document.getElementById("clearCompleted");

export function setupEventListeners() {
    addBtn.addEventListener("click", addTask);
    input.addEventListener("keypress", (e) => { if (e.key === "Enter") addTask(); });

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            setFilter(btn.dataset.filter);
            renderTasks(startEditingTask);
        });
    });

    list.addEventListener("click", handleListClick);
}

export async function addTask() {
    const text = input.value.trim();
    if (!text) return;

    const newTask = await addTaskToServer(text);
    if (newTask) renderTasks(startEditingTask);

    input.value = "";
    input.focus();
}

export function startEditingTask(task, span) {
    const inputEl = document.createElement("input");
    inputEl.type = "text";
    inputEl.value = task.text;
    inputEl.className = "edit-input";
    span.replaceWith(inputEl);
    inputEl.focus();

    async function save() {
        const newText = inputEl.value.trim();
        if (newText) {
            task.text = newText;
            await updateTaskOnServer(task);
        }
        inputEl.replaceWith(span);
        span.textContent = task.text;
    }

    inputEl.addEventListener("keypress", e => { if (e.key === "Enter") save(); });
    inputEl.addEventListener("blur", save);
}

export async function handleListClick(e) {
    const li = e.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);

    if (e.target.tagName === "BUTTON") {
        li.classList.add("removed");
        setTimeout(async () => {
            await deleteTaskFromServer(id);
            renderTasks(startEditingTask);
        }, 300);
    } else {
        if (e.target.tagName === "INPUT" || e.target.tagName === "SPAN") return;

        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            await updateTaskOnServer(task);
            renderTasks(startEditingTask);
        }
    }
}


clearBtn.addEventListener("click", async () => {
    const completedTasks = tasks.filter(t => t.completed);

    for (const task of completedTasks) {
        if (deleteTaskFromServer) {
            await deleteTaskFromServer(task.id);
        } else {
            tasks.splice(tasks.indexOf(task), 1);
        }
    }

    renderTasks(startEditingTask); // we are updating the list and the button
});