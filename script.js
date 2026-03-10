// Get DOM elements
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");


// Event listener for "Add" button and Enter key
addBtn.addEventListener("click", addTask);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});


// Function to add a new task
function addTask() {
    const text = input.value.trim();    // get input value
    if (text === "") return;    // ignore empty tasks

    // Create new list item
    const li = document.createElement("li");
    li.textContent = text;

    // Toggle completed on click
    li.addEventListener("click", () => {
        li.classList.toggle("completed");
    });

    // Add to task list
    list.appendChild(li);

    // Clear input
    input.value = "";
}