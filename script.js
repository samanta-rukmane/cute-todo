// Get DOM elements
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");


// Event listener for "Add" button and Enter key
addBtn.addEventListener("click", addTask);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});


let tasks = [];    // array for storing tasks

if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.forEach(t => {
        createTaskElement(t.text, t.completed);
    });
}


// Function to add a new task
function addTask() {
    const text = input.value.trim();    // get input value
    if (text === "") return;    // ignore empty tasks

    tasks.push({text: text, completed: false});    // add task to array
    localStorage.setItem("tasks", JSON.stringify(tasks));    // save the array in localStorage

    createTaskElement(text, false);

    input.value = "";    // clear input
}


function createTaskElement(text, completed) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = text;
    if (completed) span.classList.add("completed");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "×";
    deleteBtn.style.marginLeft = "10px";

    li.addEventListener("click", (e) => {
        if (e.target !== deleteBtn) {
            span.classList.toggle("completed");

            const taskObj = tasks.find(t => t.text === text);
            if (taskObj) taskObj.completed = span.classList.contains("completed");
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    });

    deleteBtn.addEventListener("click", () => {
        li.classList.add("removed");
        setTimeout(() => {
            list.removeChild(li);
            tasks = tasks.filter(t => t.text !== text);
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }, 300);
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
}