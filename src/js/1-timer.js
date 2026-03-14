import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css"; 

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const input = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("[data-start]"); 
startBtn.disabled = true; 
let userSelectedDate; 

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
userSelectedDate = selectedDates[0];

if (userSelectedDate < new Date()) {
   iziToast.error({
message: "Please choose a date in the future",
});
startBtn.disabled = true;
} else {
startBtn.disabled = false;
}

 },
};


flatpickr(input, options);

startBtn.addEventListener("click", () => {
  if (!userSelectedDate) return;
  
  
  startBtn.disabled = true;
  input.disabled = true;

  let timerId = setInterval(() => {
    const now = new Date();
    const deltaTime = userSelectedDate - now;

    if (deltaTime <= 0) {
  clearInterval(timerId);
  updateDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      input.disabled = false;
      startBtn.disabled = true; 
      return;
    }

    const time = convertMs(deltaTime);
    updateDisplay(time);

  }, 1000);
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
return String(value).padStart(2, "0");
} 

function updateDisplay({ days, hours, minutes, seconds }) {
document.querySelector("[data-days]").textContent = addLeadingZero(days);
document.querySelector("[data-hours]").textContent = addLeadingZero(hours);
document.querySelector("[data-minutes]").textContent = addLeadingZero(minutes);
document.querySelector("[data-seconds]").textContent = addLeadingZero(seconds);
}
