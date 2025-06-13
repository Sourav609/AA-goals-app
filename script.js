const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const alarmAudio = document.getElementById("alarm-audio");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.done) li.classList.add("done");

    li.innerHTML = `
      <span>${task.title} - ${new Date(task.time).toLocaleString()}</span>
      <div class="task-buttons">
        ${!task.done ? `<button onclick="markAsDone(${index})">✅</button>` : ""}
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function markAsDone(index) {
  tasks[index].done = true;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("task-title").value;
  const time = document.getElementById("task-time").value;

  if (!title || !time) return alert("Please enter task title and time.");

  tasks.push({ title, time, done: false });
  saveTasks();
  renderTasks();
  taskForm.reset();
});

// 🕒 Alarm check
setInterval(() => {
  const now = new Date().getTime();
  tasks.forEach((task) => {
    const taskTime = new Date(task.time).getTime();
    if (!task.done && taskTime <= now) {
      // 🔔 Show Notification
      if ("Notification" in window && Notification.permission === "granted") {
  new Notification("⏰ Task Reminder", {
    body: task.title,
  });
}
      // 🔊 Play sound
      alarmAudio.play();
    }
  });
}, 30000); // Check every 30 seconds

// 🔔 Ask for notification permission
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// 🚀 Initial render
renderTasks();