let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let ids = tasks.map(element => element.id);
let nextId = ids.length > 0 ? ids.reduce((a, b) => a > b ? a : b) + 1 : 0;

let newTaskField = document.getElementById("input-task");

let addTaskButton = document.getElementById("add-task-button");
addTaskButton.onclick = () => addNewTask();

let taskList = document.getElementById("task-list");

restoreTasks();
addCheckBoxListeners();

function addCheckBoxListeners() {
    document.querySelectorAll(".form-check-input")
        .forEach(checkbox => checkbox.onclick = () => {
            const taskDescription = checkbox.parentElement.childNodes.item(1);
            toggleDone(taskDescription, checkbox.checked)
        });
}

function restoreTasks() {
    tasks.forEach(task => addTask(task));
}

function addTask(task) {
    const newTask = createNewTask(task);
    taskList.append(newTask);
}

function saveTasksToStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addNewTask() {
    const description = newTaskField.value;

    if (!description) {
        alert("Task description shouldn't' be empty!");
        return;
    }
    const persistentTask = {
        id: nextId++,
        description: description,
        checked: false
    };
    addTask(persistentTask);

    newTaskField.value = "";

    tasks.push(persistentTask);
    saveTasksToStorage();
}

function createNewTask(task) {
    let newTask = document.createElement("li");
    newTask.classList.add("list-group-item");

    const newSpan = getTaskSpan(task);
    const taskCheckbox = getTaskCheckbox();
    taskCheckbox.checked = task.checked;
    taskCheckbox.onclick = () => toggleDone(newSpan, taskCheckbox.checked);
    toggleDone(newSpan, taskCheckbox.checked); // To restore status.

    const deleteButton = getDeleteButton();
    deleteButton.onclick = () => deleteTask(newTask, newSpan.dataset.id);

    newTask.append(taskCheckbox);
    newTask.append(newSpan);
    newTask.append(deleteButton);

    return newTask;
}

function getTaskCheckbox() {
    let newInput = document.createElement("input");
    newInput.type = "checkbox";
    newInput.className = "form-check-input me-1";
    return newInput;
}

function getTaskSpan(task) {
    let newSpan = document.createElement("span");
    newSpan.classList.add("task");
    newSpan.innerText = task.description;
    newSpan.dataset.id = task.id;
    return newSpan;
}

function getDeleteButton() {
    let newButton = document.createElement("button");
    newButton.className = "delete-btn bi bi-x-circle-fill float-right";
    return newButton;
}

function deleteTask(parentElement, id) {
    taskList.removeChild(parentElement);
    tasks = tasks.filter(task => task.id !== +id);
    saveTasksToStorage();
}

function toggleDone(taskDescription, checked) {
    if (checked) {
        taskDescription.classList.add("done");
    } else {
        taskDescription.classList.remove("done");
    }
    tasks.forEach(task => {
        if (task.id === +taskDescription.dataset.id) {
            task.checked = checked;
        }
    });
    saveTasksToStorage();
}
