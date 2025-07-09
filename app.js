const bells = new Audio('./sounds/preview.mp3');
const startBtn = document.querySelector('.btn-start');
const resetBtn = document.querySelector('.btn-reset');
const message = document.querySelector('.app-message');
const minuteDisplay = document.querySelector('.minutes');
const secondDisplay = document.querySelector('.seconds');
const timerModes = document.querySelectorAll('.timer-mode');

let myInterval;
let totalSeconds = 25 * 60;
let duration = 25 * 60;
let state = true;

// Handle Mode Switching
timerModes.forEach((btn) => {
  btn.addEventListener('click', () => {
    clearInterval(myInterval);
    state = true;
    timerModes.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const minutes = parseInt(btn.getAttribute('data-time'));
    duration = minutes * 60;
    totalSeconds = duration;
    updateDisplay(minutes, 0);
    message.textContent = 'Press start to begin';
    startBtn.disabled = false;
  });
});

function updateDisplay(mins, secs) {
  minuteDisplay.textContent = `${mins}`;
  secondDisplay.textContent = secs < 10 ? `0${secs}` : `${secs}`;
}

function updateProgressCircle(percent) {
  const left = document.querySelector('.left-side.circle');
  const right = document.querySelector('.right-side.circle');

  const angle = percent * 360;

  if (angle <= 180) {
    right.style.transform = `rotate(${angle}deg)`;
    left.style.transform = `rotate(0deg)`;
  } else {
    right.style.transform = `rotate(180deg)`;
    left.style.transform = `rotate(${angle - 180}deg)`;
  }
}

function appTimer() {
  if (!state) return alert('Session already running!');
  state = false;
  startBtn.disabled = true;
  message.textContent = 'Session running...';

  myInterval = setInterval(() => {
    const minutesLeft = Math.floor(totalSeconds / 60);
    const secondsLeft = totalSeconds % 60;
    updateDisplay(minutesLeft, secondsLeft);

    const percentElapsed = 1 - totalSeconds / duration;
    updateProgressCircle(percentElapsed);

    if (totalSeconds <= 0) {
      bells.play();
      clearInterval(myInterval);
      message.textContent = 'Session complete!';
      state = true;
      startBtn.disabled = false;
      return;
    }

    totalSeconds--;
  }, 1000);
}

function resetTimer() {
  clearInterval(myInterval);
  totalSeconds = duration;
  state = true;
  updateProgressCircle(0);
  updateDisplay(Math.floor(duration / 60), 0);
  message.textContent = 'Press start to begin';
  startBtn.disabled = false;
}

startBtn.addEventListener('click', appTimer);
resetBtn.addEventListener('click', resetTimer);

const customInput = document.querySelector('.custom-time-input');

function appTimer() {
  if (!state) return alert('Session already running!');
  state = false;
  startBtn.disabled = true;
  message.textContent = 'Session running...';

  // 🔁 Use custom time if provided
  const customMinutes = parseInt(customInput.value);
  if (!isNaN(customMinutes) && customMinutes > 0) {
    totalSeconds = customMinutes * 60;
    duration = totalSeconds;
  }

  myInterval = setInterval(() => {
    const minutesLeft = Math.floor(totalSeconds / 60);
    const secondsLeft = totalSeconds % 60;
    updateDisplay(minutesLeft, secondsLeft);

    const percentElapsed = 1 - totalSeconds / duration;
    updateProgressCircle(percentElapsed);

    if (totalSeconds <= 0) {
      bells.play();
      clearInterval(myInterval);
      message.textContent = 'Session complete!';
      state = true;
      startBtn.disabled = false;
      return;
    }

    totalSeconds--;
  }, 1000);
}


// Initial Display Setup
updateDisplay(25, 0);
updateProgressCircle(0);
