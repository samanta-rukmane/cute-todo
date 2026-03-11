import { tasks, currentFilter } from "./state.js";

const list = document.getElementById("taskList");
const counter = document.querySelector(".task-counter");

// creates li for the task
export function createTaskElement(task, startEditingTask) {
    const li = document.createElement("li");
    li.dataset.id = task.id;

    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.completed) span.classList.add("completed");

    span.addEventListener("dblclick", (e) => {
        e.stopPropagation();
        startEditingTask(task, span);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "×";
    deleteBtn.style.marginLeft = "10px";

    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);

    return li;
}

// task render with filter applied
export function renderTasks(startEditingTask) {
    list.innerHTML = "";

    let filteredTasks = tasks;
    if (currentFilter === "active") filteredTasks = tasks.filter(t => !t.completed);
    if (currentFilter === "completed") filteredTasks = tasks.filter(t => t.completed);

    filteredTasks.forEach(task => createTaskElement(task, startEditingTask));
    updateCounter();
}

// counter update
export function updateCounter() {
    const activeCount = tasks.filter(t => !t.completed).length;
    counter.textContent = `${activeCount} task${activeCount !== 1 ? "s" : ""} left`;
}