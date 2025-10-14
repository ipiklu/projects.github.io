// --- DOM Element References ---
const mainTimeDisplay = document.getElementById('mainTimeDisplay');
const alarmHourSelect = document.getElementById('alarmHourSelect');
const alarmMinuteSelect = document.getElementById('alarmMinuteSelect');
const alarmPeriodSelect = document.getElementById('alarmPeriodSelect');
const setAlarmBtn = document.getElementById('setAlarmBtn');
const snoozeBtn = document.getElementById('snoozeBtn');
const stopAlarmBtn = document.getElementById('stopAlarmBtn');
const alarmAudio = document.getElementById('alarmAudio');

// --- Configuration & State ---
let alarmTime = null;
let isAlarmSet = false;
let isRinging = false;

// --- Utility Functions ---
const pad = (num) => (num < 10 ? '0' + num : num);

const to12Hour = (hour24) => {
    let hour = hour24 % 12;
    if (hour === 0) hour = 12;
    const period = hour24 >= 12 ? 'PM' : 'AM';
    return { hour12: hour, period };
};

const get24HourTime = (hour12, minute, period) => {
    let h = parseInt(hour12, 10);
    const m = pad(parseInt(minute, 10));

    if (period === 'PM' && h !== 12) {
        h += 12;
    } else if (period === 'AM' && h === 12) {
        h = 0;
    }
    return `${pad(h)}:${m}`;
};

// --- Selector Logic ---

/**
 * Gets the selected value directly from a <select> element.
 */
function getSelectedValue(select) {
    return select.value;
}

/**
 * Sets the selected value directly on a <select> element.
 */
function setSelectedValue(select, valueToSelect) {
    select.value = String(valueToSelect);
}

/**
 * Updates the main time display to show the time selected in the dropdowns 
 * when the alarm is not set, acting as a live preview.
 */
function updateAlarmTimePreview() {
    if (isAlarmSet) return;
    
    const hour = getSelectedValue(alarmHourSelect);
    const minute = getSelectedValue(alarmMinuteSelect);
    const period = getSelectedValue(alarmPeriodSelect);

    if (hour && minute && period) {
        // Display selected time with "--" for seconds to show it's a preview
        mainTimeDisplay.textContent = `${pad(hour)}:${minute}:-- ${period}`;
        mainTimeDisplay.classList.remove('set-alarm-time');
    }
}

// --- Initialization ---

function populateSelectors() {
    // Helper to append options to a select element
    const appendOptions = (select, start, end, step, usePad = false) => {
        select.innerHTML = '';
        for (let i = start; i <= end; i += step) {
            const val = usePad ? pad(i) : String(i);
            const option = document.createElement('option');
            option.value = val;
            option.textContent = val;
            select.appendChild(option);
        }
    };

    // 1. Populate all selectors
    appendOptions(alarmHourSelect, 1, 12, 1);
    appendOptions(alarmMinuteSelect, 0, 59, 1, true);
    
    const periodSelect = alarmPeriodSelect;
    periodSelect.innerHTML = '';
    ['AM', 'PM'].forEach(val => {
        const option = document.createElement('option');
        option.value = val;
        option.textContent = val;
        periodSelect.appendChild(option);
    });

    // 2. Determine initial values (current time)
    const now = new Date();
    const { hour12, period } = to12Hour(now.getHours());
    const currentMinute = pad(now.getMinutes());

    // 3. Set the initial selected values
    setSelectedValue(alarmHourSelect, hour12);
    setSelectedValue(alarmMinuteSelect, currentMinute);
    setSelectedValue(alarmPeriodSelect, period);

    updateTime();
}


// --- Main Clock and Alarm Display Logic ---

/**
 * Displays the actual current time.
 */
function updateLiveClock() {
    const now = new Date();
    const hours24 = now.getHours();
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    const { hour12, period } = to12Hour(hours24);

    mainTimeDisplay.textContent = `${pad(hour12)}:${minutes}:${seconds} ${period}`;
    mainTimeDisplay.classList.remove('set-alarm-time');
}


/**
 * Updates the main time display every second and checks the alarm.
 */
function updateTime() {
    if (isAlarmSet && !isRinging) {
        // 1. If alarm is set, display the set alarm time (no seconds)
        const [h24, m] = alarmTime.split(':');
        const { hour12, period } = to12Hour(parseInt(h24));
        mainTimeDisplay.textContent = `${pad(hour12)}:${m} ${period}`;
        mainTimeDisplay.classList.add('set-alarm-time');

        // Check alarm
        const now = new Date();
        const currentTime24 = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
        if (currentTime24 === alarmTime) {
            triggerAlarm();
        }
    } else {
        // 2. Otherwise, display the live clock (with seconds)
        updateLiveClock();
    }
}

// --- Alarm Controls ---

function setAlarm() {
    if (isAlarmSet) {
        clearAlarm();
        return;
    }

    const hour = getSelectedValue(alarmHourSelect);
    const minute = getSelectedValue(alarmMinuteSelect);
    const period = getSelectedValue(alarmPeriodSelect);

    if (!hour || !minute || !period) {
        console.error("Selection incomplete. Cannot set alarm.");
        return;
    }

    alarmTime = get24HourTime(hour, minute, period);
    isAlarmSet = true;

    setAlarmBtn.textContent = 'Clear Alarm';

    // Disable selectors
    [alarmHourSelect, alarmMinuteSelect, alarmPeriodSelect].forEach(select => select.closest('.time-column').classList.add('disabled-select'));

    updateTime(); 
}

function triggerAlarm() {
    if (isRinging) return;

    isRinging = true;
    alarmAudio.play().catch(e => console.error("Audio playback failed (user interaction required):", e));
    mainTimeDisplay.classList.add('alarming');

    setAlarmBtn.disabled = true;
    snoozeBtn.disabled = false;
    stopAlarmBtn.disabled = false;
}

function clearAlarm() {
    isRinging = false;
    alarmTime = null;
    isAlarmSet = false;
    alarmAudio.pause();
    alarmAudio.currentTime = 0;

    setAlarmBtn.textContent = 'Set Alarm';
    setAlarmBtn.disabled = false;
    snoozeBtn.disabled = true;
    stopAlarmBtn.disabled = true;

    mainTimeDisplay.classList.remove('alarming');

    // Enable selectors
    [alarmHourSelect, alarmMinuteSelect, alarmPeriodSelect].forEach(select => select.closest('.time-column').classList.remove('disabled-select'));

    updateTime(); 
}

function snoozeAlarm() {
    clearAlarm(); 

    const now = new Date();
    const snoozeTime = new Date(now.getTime() + 5 * 60000);

    const { hour12, period } = to12Hour(snoozeTime.getHours());
    const minute = pad(snoozeTime.getMinutes());

    alarmTime = get24HourTime(hour12, minute, period);
    isAlarmSet = true;

    setAlarmBtn.textContent = 'Snoozing...';
    setAlarmBtn.disabled = true;
    snoozeBtn.disabled = true;
    stopAlarmBtn.disabled = false;

    // Visually update the selectors to the snooze time
    setSelectedValue(alarmHourSelect, hour12);
    setSelectedValue(alarmMinuteSelect, minute);
    setSelectedValue(alarmPeriodSelect, period);

    updateTime();
}

// --- Event Listeners ---

// 1. Set and Control buttons
setAlarmBtn.addEventListener('click', setAlarm);
stopAlarmBtn.addEventListener('click', clearAlarm);
snoozeBtn.addEventListener('click', snoozeAlarm);

// 2. Selector change listeners (for previewing the time)
[alarmHourSelect, alarmMinuteSelect, alarmPeriodSelect].forEach(select => {
    select.addEventListener('change', updateAlarmTimePreview);
});


// --- Initialization Call ---
populateSelectors();
// Start the clock loop
setInterval(updateTime, 1000);

function reloadClear() {
  window.localStorage.clear();
  window.location.reload(true);
  return false;
}

<!---POPUP Coustomization---> 
	  function view() {
          alertify.alert("<a href='https://www.linkedin.com/in/sayantan-kundu-52650758' target='_blank'><img src='img/linkedin.png' style='max-width: 90%; max-height: 70%'/></a><br/><a href='https://twitter.com/piklu21' target='_blank'><img src='img/twitter.png' style='max-width: 30%; max-height: 30%'/></a><a href='https://www.facebook.com/kundupiklu' target='_blank'><img src='img/facebook.jpg' style='max-width: 30%; max-height: 30%'/> </a><a href='https://www.instagram.com/i_piklu/' target='_blank'><img src='img/instagram.png' style='max-width: 30%; max-height: 30%'/></a><p class='index' style='font-style:italic; font-weight:bolder; font-size:25px' />STAY HOME, STAY SAFE.</p><p class='index' style='font-style:italic; font-weight:bolder; font-size:25px' />#Covid-19 #HomeQuarantine</p>");
          return false;
    }