// DOM Element References
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let taskCounter = 0;

/**
 * Creates and returns a single task item <li> node safely without innerHTML.
 */
function createTaskElement(taskText, taskId) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.taskId = taskId;
  li.dataset.state = "pending";

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = taskText;

  const completeBtn = document.createElement("button");
  completeBtn.className = "complete-btn";
  completeBtn.textContent = "Complete";

  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.textContent = "Edit";

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "Remove";

  li.appendChild(span);
  li.appendChild(completeBtn);
  li.appendChild(editBtn);
  li.appendChild(removeBtn);

  return li;
}

/**
 * Calculates total, pending, and completed tasks directly from current DOM nodes.
 */
function updateTaskCounts() {
  const allTasks = taskList.querySelectorAll(".task-item");
  let total = allTasks.length;
  let pending = 0;
  let completed = 0;

  allTasks.forEach((task) => {
    if (task.dataset.state === "completed") {
      completed++;
    } else {
      pending++;
    }
  });

  totalCount.textContent = total;
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
}

/**
 * Validates text input, generates unique task ID, appends task, and updates UI state.
 */
function addTask(taskText) {
  const trimmedText = taskText.trim();

  if (trimmedText === "") {
    taskMessage.textContent = "Task cannot be empty";
    return;
  }

  taskMessage.textContent = "";
  taskCounter++;
  const taskId = `task-${taskCounter}`;

  const taskElement = createTaskElement(trimmedText, taskId);
  taskList.appendChild(taskElement);

  taskInput.value = "";
  updateTaskCounts();
}

/**
 * Toggles pending/completed state using classList and dataset updates.
 */
function toggleTaskComplete(taskItem) {
  taskItem.classList.toggle("completed");
  const isCompleted = taskItem.classList.contains("completed");
  taskItem.dataset.state = isCompleted ? "completed" : "pending";
  updateTaskCounts();
}

/**
 * Replaces visible text span with an input field for inline editing.
 */
function beginTaskEdit(taskItem) {
  const taskTextSpan = taskItem.querySelector(".task-text");
  if (!taskTextSpan) return;

  const currentText = taskTextSpan.textContent;
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "edit-input";
  editInput.value = currentText;

  const editBtn = taskItem.querySelector(".edit-btn");
  if (editBtn) {
    editBtn.textContent = "Save";
  }

  taskItem.replaceChild(editInput, taskTextSpan);
  editInput.focus();
}

/**
 * Validates edit input and safely converts back to task text span using textContent.
 */
function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");
  if (!editInput) return;

  const newText = editInput.value.trim();

  if (newText === "") {
    taskMessage.textContent = "Task cannot be empty";
    return;
  }

  taskMessage.textContent = "";

  const newSpan = document.createElement("span");
  newSpan.className = "task-text";
  newSpan.textContent = newText;

  const editBtn = taskItem.querySelector(".edit-btn");
  if (editBtn) {
    editBtn.textContent = "Edit";
  }

  taskItem.replaceChild(newSpan, editInput);
}

/**
 * Deletes task element directly from DOM and refreshes counts.
 */
function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

/**
 * Delegated click event handler attached exclusively to #taskList.
 */
function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest(".task-item");

  if (!taskItem) return;

  if (target.matches(".complete-btn") || target.classList.contains("complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (target.matches(".edit-btn") || target.classList.contains("edit-btn")) {
    if (target.textContent === "Save") {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (target.matches(".remove-btn") || target.classList.contains("remove-btn")) {
    removeTask(taskItem);
  }
}

/**
 * Creates preset sample items inside a DocumentFragment and appends them in a single batch.
 */
function loadSampleTasks() {
  const sampleTexts = [
    "Review DOM selectors",
    "Practice createElement",
    "Study event delegation"
  ];

  const fragment = document.createDocumentFragment();

  sampleTexts.forEach((text) => {
    taskCounter++;
    const taskId = `task-${taskCounter}`;
    const taskElement = createTaskElement(text, taskId);
    fragment.appendChild(taskElement);
  });

  taskList.appendChild(fragment);
  taskMessage.textContent = "";
  updateTaskCounts();
}

// Event Listeners
addTaskBtn.addEventListener("click", () => {
  addTask(taskInput.value);
});

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask(taskInput.value);
  }
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);

taskList.addEventListener("click", handleTaskListClick);