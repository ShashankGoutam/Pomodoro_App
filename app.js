const bells = new Audio('./sounds/preview.mp3');

const pauseBtn = document.querySelector('.btn-pause');
const muteBtn = document.querySelector('.btn-mute');
const customInput = document.querySelector('.custom-time-input');
const focusInput = document.querySelector('.focus-input');
const leftCircle = document.querySelector('.left-side.circle');
const rightCircle = document.querySelector('.right-side.circle');

const STORAGE_KEYS = {
  focusTask: 'pomodoro.focusTask',
  selectedMode: 'pomodoro.selectedMode',
  customMinutes: 'pomodoro.customMinutes',
  isMuted: 'pomodoro.isMuted',
};

const MODE_MINUTES = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
};

let totalSeconds = MODE_MINUTES.pomodoro * 60;
let duration = MODE_MINUTES.pomodoro * 60;
let isRunning = false;
let isPaused = false;
let isMuted = false;
let currentMode = 'pomodoro';

function getStoredValue(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function setStoredValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // Storage can fail in restricted preview/browser modes.
  }
}

function getFocusText() {
  const focusText = focusInput.value.trim();
  return focusText ? `Focus: ${focusText}` : 'Session running...';
}

function updateStatus(baseMessage = 'Press start to begin') {
  const focusText = focusInput.value.trim();

  if (baseMessage === 'Session running...') {
    message.textContent = getFocusText();
    return;
  }

  if ((baseMessage === 'Session paused.' || baseMessage === 'Session complete!') && focusText) {
    message.textContent = `${baseMessage} (${focusText})`;
    return;
  }

  message.textContent = baseMessage;
}

    rightCircle.style.transform = `rotate(${angle}deg)`;
    leftCircle.style.transform = 'rotate(0deg)';
    rightCircle.style.transform = 'rotate(180deg)';
    leftCircle.style.transform = `rotate(${angle - 180}deg)`;
  }
}

function persistSettings() {
  setStoredValue(STORAGE_KEYS.focusTask, focusInput.value);
  setStoredValue(STORAGE_KEYS.selectedMode, currentMode);
  setStoredValue(STORAGE_KEYS.customMinutes, customInput.value);
  setStoredValue(STORAGE_KEYS.isMuted, String(isMuted));
}

function setActiveMode(modeName) {
  currentMode = modeName;
  timerModes.forEach((modeBtn) => {
    modeBtn.classList.toggle('active', modeBtn.dataset.mode === modeName);
  });
}

function setMode(modeName) {
  clearInterval(myInterval);
  isRunning = false;
  isPaused = false;

  setActiveMode(modeName);
  const minutes = MODE_MINUTES[modeName];
  duration = minutes * 60;
  totalSeconds = duration;

  customInput.value = '';
  pauseBtn.disabled = true;
  pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';

  updateDisplay(minutes, 0);
  updateProgressCircle(0);
  updateStatus('Press start to begin');
  startBtn.disabled = false;

  persistSettings();
}

function applyCustomDuration(minutes) {
  clearInterval(myInterval);
  isRunning = false;
  isPaused = false;

  duration = minutes * 60;
  totalSeconds = duration;
  setActiveMode('custom');

  pauseBtn.disabled = true;
  pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';

  updateDisplay(minutes, 0);
  updateProgressCircle(0);
  updateStatus('Custom timer ready');
  startBtn.disabled = false;

  persistSettings();
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function notifyCompletion() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Pomodoro complete', {
      body: 'Great work! Time for your next break or focus block.',
    });
  }
}

function onTimerComplete() {
  clearInterval(myInterval);
  isRunning = false;
  isPaused = false;
  pauseBtn.disabled = true;
  pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
  startBtn.disabled = false;

  if (!isMuted) {
    bells.currentTime = 0;
    bells.play();
  }

  updateStatus('Session complete!');
  notifyCompletion();
}

function tick() {
  const minutesLeft = Math.floor(totalSeconds / 60);
  const secondsLeft = totalSeconds % 60;
  updateDisplay(minutesLeft, secondsLeft);

  const percentElapsed = 1 - totalSeconds / duration;
  updateProgressCircle(percentElapsed);

  if (totalSeconds <= 0) {
    onTimerComplete();
    return;

  totalSeconds -= 1;

function startTimer() {
  if (isRunning) {
    return;
  }

  isRunning = true;
  isPaused = false;

  pauseBtn.disabled = false;
  pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';

  updateStatus('Session running...');
  requestNotificationPermission();

  tick();
  myInterval = setInterval(tick, 1000);
}

function pauseTimer() {
  if (!isRunning) {
    return;
  }

  clearInterval(myInterval);
  isRunning = false;
  isPaused = true;

  startBtn.disabled = false;
  pauseBtn.disabled = false;
  pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';

  updateStatus('Session paused.');
  isRunning = false;
  isPaused = false;

  updateStatus('Press start to begin');

  pauseBtn.disabled = true;
  pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';

function toggleMute() {
  isMuted = !isMuted;
  muteBtn.setAttribute('aria-pressed', String(isMuted));
  muteBtn.innerHTML = isMuted
    ? '<i class="fas fa-volume-mute"></i> Muted'
    : '<i class="fas fa-volume-up"></i> Sound On';
  persistSettings();
}

function loadSavedSettings() {
  const savedFocusTask = getStoredValue(STORAGE_KEYS.focusTask);
  const savedMode = getStoredValue(STORAGE_KEYS.selectedMode);
  const savedCustomMinutes = getStoredValue(STORAGE_KEYS.customMinutes);
  const savedMuteState = getStoredValue(STORAGE_KEYS.isMuted);
  if (savedFocusTask) {
    focusInput.value = savedFocusTask;
  }

  if (savedMuteState === 'true') {
    isMuted = true;
    muteBtn.setAttribute('aria-pressed', 'true');
    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Muted';
  }

  if (savedCustomMinutes && Number(savedCustomMinutes) > 0) {
    customInput.value = savedCustomMinutes;
    applyCustomDuration(Number(savedCustomMinutes));
    return;
  }

  if (savedMode && MODE_MINUTES[savedMode]) {
    setMode(savedMode);
    return;
  }
  setMode('pomodoro');
focusInput.addEventListener('input', () => {
  if (isRunning) {
    updateStatus('Session running...');
  }
  persistSettings();
});

customInput.addEventListener('change', () => {
  const customMinutes = Number(customInput.value);

  if (!Number.isInteger(customMinutes) || customMinutes <= 0) {
    customInput.value = '';
    if (!isRunning && !isPaused) {
      updateStatus('Enter a valid custom duration in minutes.');
    }
    persistSettings();
    return;
  }

  applyCustomDuration(customMinutes);
});

timerModes.forEach((modeBtn) => {
  modeBtn.addEventListener('click', () => {
    const selectedMode = modeBtn.dataset.mode;
    setMode(selectedMode);
  });
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', () => {
  if (isRunning) {
    pauseTimer();
    return;
  }

  if (isPaused) {
    startTimer();
  }
});
resetBtn.addEventListener('click', resetTimer);
muteBtn.addEventListener('click', toggleMute);
loadSavedSettings();
  setStoredValue(STORAGE_KEYS.isMuted, String(isMuted));
}

function setActiveMode(modeName) {
  currentMode = modeName;
  timerModes.forEach((modeBtn) => {
    modeBtn.classList.toggle('active', modeBtn.dataset.mode === modeName);
  });
}

function setMode(modeName) {
  clearInterval(myInterval);
  isRunning = false;
  isPaused = false;

  setActiveMode(modeName);
  const minutes = MODE_MINUTES[modeName];
  duration = minutes * 60;
  totalSeconds = duration;

  customInput.value = '';
  pauseBtn.disabled = true;
  pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';

  updateDisplay(minutes, 0);
  updateProgressCircle(0);
  updateStatus('Press start to begin');
  startBtn.disabled = false;

  persistSettings();
}

function applyCustomDuration(minutes) {
  clearInterval(myInterval);
  isRunning = false;
  isPaused = false;

  duration = minutes * 60;
  totalSeconds = duration;
  setActiveMode('custom');

  pauseBtn.disabled = true;
  pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';

  updateDisplay(minutes, 0);
  updateProgressCircle(0);
  updateStatus('Custom timer ready');
  startBtn.disabled = false;

  persistSettings();
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function notifyCompletion() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Pomodoro complete', {
      body: 'Great work! Time for your next break or focus block.',
    });
  }
}

function onTimerComplete() {
  clearInterval(myInterval);
  isRunning = false;
  isPaused = false;
  pauseBtn.disabled = true;
  pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
  startBtn.disabled = false;

  if (!isMuted) {
    bells.currentTime = 0;
    bells.play();
  }

  updateStatus('Session complete!');
  notifyCompletion();
}

function tick() {
  const minutesLeft = Math.floor(totalSeconds / 60);
  const secondsLeft = totalSeconds % 60;
  updateDisplay(minutesLeft, secondsLeft);

  const percentElapsed = 1 - totalSeconds / duration;
  updateProgressCircle(percentElapsed);

  if (totalSeconds <= 0) {
    onTimerComplete();
    return;
  }

  totalSeconds -= 1;
}

function startTimer() {
  if (isRunning) {
    return;
  }

  isRunning = true;
  isPaused = false;

  startBtn.disabled = true;
  pauseBtn.disabled = false;
  pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';

  updateStatus('Session running...');
  requestNotificationPermission();

  tick();
  myInterval = setInterval(tick, 1000);
}

function pauseTimer() {
  if (!isRunning) {
    return;
  }

  clearInterval(myInterval);
  isRunning = false;
  isPaused = true;

  startBtn.disabled = false;
  pauseBtn.disabled = false;
  pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';

  updateStatus('Session paused.');
}

function resetTimer() {
  clearInterval(myInterval);
  isRunning = false;
  isPaused = false;

  totalSeconds = duration;
  updateProgressCircle(0);
  updateDisplay(Math.floor(duration / 60), 0);
  updateStatus('Press start to begin');

  startBtn.disabled = false;
  pauseBtn.disabled = true;
  pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
}

function toggleMute() {
  isMuted = !isMuted;
  muteBtn.setAttribute('aria-pressed', String(isMuted));
  muteBtn.innerHTML = isMuted
    ? '<i class="fas fa-volume-mute"></i> Muted'
    : '<i class="fas fa-volume-up"></i> Sound On';
  persistSettings();
}

function loadSavedSettings() {
  const savedFocusTask = getStoredValue(STORAGE_KEYS.focusTask);
  const savedMode = getStoredValue(STORAGE_KEYS.selectedMode);
  const savedCustomMinutes = getStoredValue(STORAGE_KEYS.customMinutes);
  const savedMuteState = getStoredValue(STORAGE_KEYS.isMuted);

  if (savedFocusTask) {
    focusInput.value = savedFocusTask;
  }

  if (savedMuteState === 'true') {
    isMuted = true;
    muteBtn.setAttribute('aria-pressed', 'true');
    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Muted';
  }

  if (savedCustomMinutes && Number(savedCustomMinutes) > 0) {
    customInput.value = savedCustomMinutes;
    applyCustomDuration(Number(savedCustomMinutes));
    return;
  }

  if (savedMode && MODE_MINUTES[savedMode]) {
    setMode(savedMode);
    return;
  }

  setMode('pomodoro');
}

focusInput.addEventListener('input', () => {
  if (isRunning) {
    updateStatus('Session running...');
  }
  persistSettings();
});

customInput.addEventListener('change', () => {
  const customMinutes = Number(customInput.value);

  if (!Number.isInteger(customMinutes) || customMinutes <= 0) {
    customInput.value = '';
    if (!isRunning && !isPaused) {
      updateStatus('Enter a valid custom duration in minutes.');
    }
    persistSettings();
    return;
  }

  applyCustomDuration(customMinutes);
});

timerModes.forEach((modeBtn) => {
  modeBtn.addEventListener('click', () => {
    const selectedMode = modeBtn.dataset.mode;
    setMode(selectedMode);
  });
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', () => {
  if (isRunning) {
    pauseTimer();
    return;
  }

  if (isPaused) {
    startTimer();
  }
});
resetBtn.addEventListener('click', resetTimer);
muteBtn.addEventListener('click', toggleMute);

// Initial Setup
loadSavedSettings();
updateProgressCircle(0);
