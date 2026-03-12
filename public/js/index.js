import { loadTasks } from "./state.js";
import { setupEventListeners, startEditingTask } from "./taskController.js";
import { renderTasks } from "./taskView.js";

async function init() {
    await loadTasks();    // waiting for all tasks to load from the server
    setupEventListeners();    // connect all buttons and events
    renderTasks(startEditingTask);    // render the list of tasks
}

init();    // start initialisation