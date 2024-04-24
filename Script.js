document.addEventListener("DOMContentLoaded", function () {
    loadTasks();
});

function loadTasks() {
    fetch("/api/tasks")
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById("taskList");
            taskList.innerHTML = "";
            tasks.forEach(task => {
                const taskElement = createTaskElement(task);
                taskList.appendChild(taskElement);
            });
        })
        .catch(error => console.error("Error loading tasks:", error));
}

function createTaskElement(task) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    taskElement.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""} onclick="toggleComplete(${task.id})">
        <span>${task.title}</span>
        <button onclick="editTask(${task.id}, '${task.title}')">Edit</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
    `;
    return taskElement;
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const title = taskInput.value.trim();
    if (title === "") return;

    fetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: title })
    })
    .then(response => response.json())
    .then(() => {
        taskInput.value = "";
        loadTasks();
    })
    .catch(error => console.error("Error adding task:", error));
}

function editTask(id, title) {
    const newTitle = prompt("Edit Task:", title);
    if (newTitle === null || newTitle.trim() === "") return;

    fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: newTitle })
    })
    .then(() => loadTasks())
    .catch(error => console.error("Error editing task:", error));
}

function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    fetch(`/api/tasks/${id}`, {
        method: "DELETE"
    })
    .then(() => loadTasks())
    .catch(error => console.error("Error deleting task:", error));
}

function toggleComplete(id) {
    fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ completed: true })
    })
    .then(() => loadTasks())
    .catch(error => console.error("Error toggling task completion:", error));
}
