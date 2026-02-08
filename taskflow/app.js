const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* SAVE */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* COUNTER */
function updateCounters() {
  document.querySelectorAll(".column").forEach(col => {
    const status = col.dataset.status;
    const count = tasks.filter(t => t.status === status).length;
    col.querySelector(".count").textContent = count;
  });
}

/* RENDER */
function renderTasks() {
  document.querySelectorAll(".column").forEach(col => {
    const title = col.querySelector("h2").innerHTML;
    col.innerHTML = `<h2>${title}</h2>`;
  });

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task";
    div.draggable = true;
    div.dataset.id = task.id;

    const text = document.createElement("span");
    text.textContent = task.text;

    const del = document.createElement("span");
    del.textContent = "✖";
    del.className = "delete";
    del.onclick = () => deleteTask(task.id);

    div.appendChild(text);
    div.appendChild(del);

    div.addEventListener("dragstart", dragStart);

    const column = document.querySelector(`[data-status="${task.status}"]`);
    column.appendChild(div);
  });

  updateCounters();
}

/* ADD */
function addTask() {
  if (!input.value.trim()) return;

  tasks.push({
    id: Date.now(),
    text: input.value,
    status: "todo"
  });

  saveTasks();
  renderTasks();
  input.value = "";
}

addBtn.onclick = addTask;
input.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

/* DELETE */
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

/* DRAG */
function dragStart(e) {
  e.dataTransfer.setData("id", e.target.dataset.id);
}

document.querySelectorAll(".column").forEach(col => {
  col.addEventListener("dragover", e => {
    e.preventDefault();
    col.classList.add("drag-over");
  });

  col.addEventListener("dragleave", () => {
    col.classList.remove("drag-over");
  });

  col.addEventListener("drop", e => {
    col.classList.remove("drag-over");
    const id = e.dataTransfer.getData("id");
    const task = tasks.find(t => t.id == id);
    if (task) {
      task.status = col.dataset.status;
      saveTasks();
      renderTasks();
    }
  });
});

/* INIT */
renderTasks();
