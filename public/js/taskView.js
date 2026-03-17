import { tasks, currentFilter, saveTaskOrder, setFilter } from "./state.js";

const list = document.getElementById("taskList");
const counter = document.querySelector(".task-counter");
const filterButtons = document.querySelectorAll(".filters button");

// creates li for the task
export function createTaskElement(task, startEditingTask) {
    const li = document.createElement("li");
    li.classList.add("task");
    li.draggable = true;
    li.dataset.id = task.id;

    li.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", task.id);
    });

    li.addEventListener("dragover", (e) => {
        e.preventDefault();
    });


    li.addEventListener("dragenter", () => {
        li.classList.add("drag-over");    // add highlight class
    });

    li.addEventListener("dragleave", () => {
        li.classList.remove("drag-over");    // turn off the backlight
    });


    li.addEventListener("drop", (e) => {
        e.preventDefault();
        li.classList.remove("drag-over");    // turn off the backlight

        const draggedId = Number(e.dataTransfer.getData("text/plain"));
        const targetId = Number(li.dataset.id);

        const draggedTask = tasks.find(t => t.id === draggedId);
        const targetTask = tasks.find(t => t.id === targetId);

        if (!draggedTask || !targetTask) return;

        const temp = draggedTask.order;
        draggedTask.order = targetTask.order;
        targetTask.order = temp;

        tasks.sort((a, b) => a.order - b.order);
        tasks.forEach((t, index) => t.order = index);    // update order
        renderTasks(startEditingTask);
        saveTaskOrder();
    });

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
    updateFilterUI();
}


// counter update
export function updateCounter() {
    const activeCount = tasks.filter(t => !t.completed).length;
    counter.textContent = `${activeCount} task${activeCount !== 1 ? "s" : ""} left`;
}


function updateFilterUI() {
    filterButtons.forEach(btn => {
        btn.classList.remove("active");

        if (btn.dataset.filter === currentFilter) {
            btn.classList.add("active");
        }
    });
}

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        setFilter(filter);
        updateFilterUI();
        renderTasks();
    })
})