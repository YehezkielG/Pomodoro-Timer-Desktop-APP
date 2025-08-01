let startBtn = document.getElementById("start");
let resetBtn = document.getElementById("reset");
let timerField = document.getElementById("Timer");
var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let isPaused = false;

function Reset() {
  if (isPomodoroSelected) {
    setTimer = parseFloat(inputTimer.value);
  } else {
    setTimer = parseFloat(inputBreakTimer.value);
  }
  startBtn.textContent = "Start";
  Time = setTimer * 60;
  duration = Time;
  let durationTxt = `${Math.floor(duration / 60)
    .toString()
    .padStart(2, "0")}:${(duration % 60).toString().padStart(2, "0")}`;
  timerField.innerHTML = durationTxt;
  isPaused = false;
  document.getElementById("progressBar").style = `width:0%`;
}

resetBtn.addEventListener("click", () => {
  stopTimer();
  Reset();
  resetActivity();
});

function dateString() {
  const d = new Date();
  let day = d.getDay();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let setday = days[day];
  var mounths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var getIndexMounth = d.getMonth();
  var mounth = mounths[getIndexMounth].slice(0, 3);
  var dates = d.getDate().toString();

  if (dates.length == 0) {
    dates = ("0" + d.getDate()).toString;
  }
  var year = d.getFullYear();
  return setday + ", " + mounth + " " + dates + " " + year;
}

startBtn.addEventListener("click", function () {
  this.textContent = !isPaused ? "Pause" : "continue";
  isPaused = !isPaused;
  if (!isPaused) {
    stopTimer();
    return;
  }
  Start();
});

function taskTitle() {
  for (task of tasks) {
    if (!task.completed) {
      return task.taskName;
    }
  }
  return "";
}

function notification(mins) {
  if (isPomodoroSelected) {
    ipcRenderer.send(
      "notification",
      "Focus Session Ended!",
      `Break for ${mins} mintutes 🍵`,
      "break"
    );
  } else {
    ipcRenderer.send(
      "notification",
      "Break Session Ended!",
      `Time to back Focus ♟️ in ${mins} mintutes`,
      "icon"
    );
  }
}

function Start() {
  startTimer = setInterval(() => {
    duration--;
    let durationTxt = `${Math.floor(duration / 60)
      .toString()
      .padStart(2, "0")}:${(duration % 60).toString().padStart(2, "0")}`;
    timerField.innerHTML = durationTxt;
    if (!isPomodoroSelected) {
      document.title = `${durationTxt} - Break`;
      ipcRenderer.send("update-discord-details", "Break", durationTxt);
    } else if (taskTitle()) {
      document.title = `${durationTxt} - ${taskTitle()}`;
      ipcRenderer.send(
        "update-discord-details",
        "Focus",
        `${taskTitle()} - ${durationTxt}`
      );
    } else {
      document.title = ` ${durationTxt} - Focus`;
      ipcRenderer.send("focus-whithout-todo");
    }
    let percent = ((Time - duration) / Time) * 100;
    document.getElementById("progressBar").style = `width:${percent}%`;
    if (duration <= 0) {
      document.getElementById("Audio").play();
      setHistory();
      getHistory[0] = { sessionPomodoro: previousSession + 1 };
      getHistory.push({
        activity: isPomodoroSelected ? "Focus" : "Break",
        date: dateString(),
        time: `${Math.floor(Time / 60)
          .toString()
          .padStart(2, "0")}:${(Time % 60).toString().padStart(2, "0")}`,
      });
      localStorage.setItem("histories", JSON.stringify(getHistory));
      document.querySelectorAll("#sessionCount").forEach((element) => {
        element.innerHTML = getHistory[0].sessionPomodoro;
      });
      previousSession = getHistory[0].sessionPomodoro || 0;
      clearInterval(startTimer);
      notification(
        isPomodoroSelected ? inputBreakTimer.value : inputTimer.value
      );
      switchActivity();
      resetActivity();
      Start();
    }
  }, 1000);
}

function switchActivity() {
  isPomodoroSelected = !isPomodoroSelected;
  timerOption.forEach((radio) => {
    radio.parentElement.classList.toggle("bg-gray-800");
    document.getElementById("pomodoroBtn").checked = isPomodoroSelected;
    document.getElementById("breakBtn").checked = !isPomodoroSelected;
  });
  if (isPomodoroSelected) {
    setTimer = parseFloat(inputTimer.value);
  } else {
    setTimer = parseFloat(inputBreakTimer.value);
  }
}

function resetActivity() {
  document.title = "Focus Forge";
  ipcRenderer.send("reset");
  stopTimer();
  Reset();
}

function stopTimer() {
  clearInterval(startTimer);
}

if ("Notification" in window) {
  Notification.requestPermission().then((permission) => {
    console.log("Permission:", permission);
  });
}
