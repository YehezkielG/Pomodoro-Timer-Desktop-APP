let settingBtn = document.getElementById("settingBtn");
let setBtn = document.getElementById("set");
let inputTimer = document.getElementById("setTimer");
let inputBreakTimer = document.getElementById("setBreakTimer");
let rpcToggle = document.getElementById("dcRpc");
var savedSetting = JSON.parse(localStorage.getItem("savedSetting")) || {};

let startTimer;
var setTimer = 25;
let Time = setTimer * 60;
let duration = Time;

inputTimer.value = savedSetting.fokus || 25;
inputBreakTimer.value = savedSetting.break || 5;

if (savedSetting.fokus) {
  setTimer = parseFloat(savedSetting.fokus);
  Time = setTimer * 60;
  duration = Time;
  let durationTxt = `${Math.floor(duration / 60)
    .toString()
    .padStart(2, "0")}:${(duration % 60).toString().padStart(2, "0")}`;
  timerField.innerHTML = durationTxt;
}

if(savedSetting.notification) {
  document.getElementById("Audio").src = `Notification/${savedSetting.notification}.mp3`;
document.getElementById("notificationOption").value = savedSetting.notification;
}   

settingBtn.addEventListener("click", () => {
  document.getElementById("settings").classList.remove("hidden");
});

setBtn.addEventListener("click", () => {
  if (inputTimer.value > 0 && inputBreakTimer.value > 0) {
    if (isPomodoroSelected) {
      setTimer = parseFloat(inputTimer.value);
    } else {
      setTimer = parseFloat(inputBreakTimer.value);
    }
    (savedSetting.fokus = inputTimer.value),
      (savedSetting.break = inputBreakTimer.value);
    localStorage.setItem("savedSetting", JSON.stringify(savedSetting));
    document.getElementById("settings").classList.add("hidden");
    stopTimer();
    Reset();
  }
});

if (savedSetting.showDCrpc) {
  rpcToggle.checked = true;
  ipcRenderer.send("DCrpcVisibility");
  document.getElementById("dcRpcToggle").classList.toggle("justify-end");
  document.getElementById("dcRpcToggle").classList.toggle("bg-red-300");
  document.querySelector("#dcRpcToggle div").classList.toggle("bg-red-500");
  ipcRenderer.send("reset");
}

rpcToggle.addEventListener("change", function () {
  document.getElementById("dcRpcToggle").classList.toggle("justify-end");
  document.getElementById("dcRpcToggle").classList.toggle("bg-red-300");
  document.querySelector("#dcRpcToggle div").classList.toggle("bg-red-500");
  if (!this.checked) {
    ipcRenderer.send("DCrpcVisibility");
    savedSetting.showDCrpc = false;
  } else {
    savedSetting.showDCrpc = true;
    ipcRenderer.send("DCrpcVisibility");
    ipcRenderer.send("reset");
  }
  localStorage.setItem("savedSetting", JSON.stringify(savedSetting));
});

document.getElementById("notificationOption").addEventListener("change", function () {
    document.getElementById("Audio").src = `Notification/${this.value}.mp3`;
    document.getElementById("Audio").play();
    savedSetting.notification = this.value;
    localStorage.setItem("savedSetting", JSON.stringify(savedSetting));
  });
