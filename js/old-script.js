// Get DOM elements
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const counter = document.querySelector(".task-counter");


// Event listener for "Add" button and Enter key
addBtn.addEventListener("click", addTask);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

list.addEventListener("click", handleListClick);

let tasks = [];    // array for storing tasks
let currentFilter = "all";    // all | active | completed


const filterButtons = document.querySelectorAll(".filters button");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;    // updating the current filter

        filterButtons.forEach(b => b.classList.remove("active"));    // switching the active class
        btn.classList.add("active");

        renderTasks();    // redrawing the list
    })
})


if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
}

renderTasks();    // drawing the list after loading


// Function to add a new task
function addTask() {
    const text = input.value.trim();    // get input value
    if (text === "") return;    // ignore empty tasks

    const task = createTaskObject(text);
    tasks.push(task);
    saveTasks();

    renderTasks();

    input.value = "";    // clear input
    input.focus();
}


function saveTasks() {    // save the array in localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function createTaskObject(text) {    // add task to array
    return {
        id: Date.now(),
        text: text, 
        completed: false
    };
}


function createTaskElement(task) {
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
}


function startEditingTask(task, span) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = task.text;
    input.className = "edit-input";
    span.replaceWith(input);
    input.focus();

    function save() {
        const newText = input.value.trim();
        if (newText !== "") {
            task.text = newText;
            saveTasks();
        }
        input.replaceWith(span);
        span.textContent = task.text;
    }

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") save();
    });

    input.addEventListener("blur", save);
}


function handleListClick(e) {
    const li = e.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);

    if (e.target.tagName === "BUTTON") {
        li.classList.add("removed");

        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        }, 300);
    } else {
        if (e.target.tagName === "INPUT") return;
        if (e.target.tagName === "SPAN") return;
        
        const span = li.querySelector("span");
        span.classList.toggle("completed");

        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = span.classList.contains("completed");
            saveTasks();

            if (
                (currentFilter === "active" && task.completed) || 
                (currentFilter === "completed" && !task.completed)
             ) {
                li.classList.add("removed");    // smoothlv hide
                setTimeout(() => renderTasks(), 300);    // redraw after animation
            } else {
                renderTasks();    // add redrawing immediately
            }
        }
    }
}


function renderTasks() {
    list.innerHTML = "";    // clear the list in the DOM

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === "completed") {
        filteredTasks = tasks.filter(t => t.completed);
    }

    filteredTasks.forEach(task => createTaskElement(task));
    updateCounter();
}


function updateCounter() {
    const activeCount = tasks.filter(t => !t.completed).length;
    counter.textContent = `${activeCount} task${activeCount !== 1 ? "s" : ""} left`;
}