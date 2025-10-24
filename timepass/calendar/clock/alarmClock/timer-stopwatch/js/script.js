// JavaScript Document

        // --- State Management ---
        let currentView = 'timer'; // Initial view set to 'timer'

        // Stopwatch State
        let stopwatchTime = 0; // Time in milliseconds
        let stopwatchInterval = null;
        let stopwatchRunning = false;
        let laps = [];
        let lastLapTime = 0;

        // Timer State
        const TIMER_STATUS = {
            IDLE: 'IDLE',
            RUNNING: 'RUNNING',
            PAUSED: 'PAUSED',
            FINISHED: 'FINISHED'
        };
        let timerStatus = TIMER_STATUS.IDLE;
        let timerDuration = 0; // Total duration set in milliseconds
        let timerRemaining = 0; // Remaining time in milliseconds
        let timerInterval = null;

        // --- DOM Elements Cache ---
        const swDisplay = document.getElementById('sw-display');
        const swMilliseconds = document.getElementById('sw-milliseconds');
        const swStartPauseBtn = document.getElementById('sw-start-pause-btn');
        const swResetBtn = document.getElementById('sw-reset-btn');
        const swLapBtn = document.getElementById('sw-lap-btn');
        const swLapsList = document.getElementById('sw-laps-list');
        const noLapsMsg = document.getElementById('no-laps-msg');
        
        const tDisplay = document.getElementById('t-display');
        const tHoursInput = document.getElementById('t-hours');
        const tMinutesInput = document.getElementById('t-minutes');
        const tSecondsInput = document.getElementById('t-seconds');
        const tStartPauseBtn = document.getElementById('t-start-pause-btn');
        const tResetBtn = document.getElementById('t-reset-btn');
        const tSetBtn = document.getElementById('t-set-btn');
        
        // Modal elements
        const genericModal = document.getElementById('generic-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        const alarmSound = document.getElementById('alarm-sound'); // Added reference to audio element

        // --- Utility Functions ---

        /**
         * Converts milliseconds to HH:MM:SS format (or HH:MM:SS.ms for stopwatch)
         * @param {number} ms - time in milliseconds
         * @returns {{display: string, ms: string}} Formatted time object
         */
        function formatTime(ms) {
            const totalSeconds = Math.floor(ms / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const milliseconds = Math.floor((ms % 1000) / 10); // get centiseconds

            const formattedHours = String(hours).padStart(2, '0');
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');
            const formattedMs = String(milliseconds).padStart(2, '0');

            const display = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
            
            return { display, ms: formattedMs };
        }
        
        /**
         * Switches between Stopwatch and Timer views.
         * @param {string} viewName - 'stopwatch' or 'timer'
         */
        function switchView(viewName) {
            currentView = viewName;
            
            document.getElementById('content-stopwatch').classList.toggle('hidden', viewName !== 'stopwatch');
            document.getElementById('content-timer').classList.toggle('hidden', viewName !== 'timer');
            
            // Manage Tab Active State
            document.getElementById('tab-stopwatch').classList.toggle('active', viewName === 'stopwatch');
            document.getElementById('tab-timer').classList.toggle('active', viewName === 'timer');
        }

        // --- STOPWATCH LOGIC (Unchanged) ---

        function updateStopwatchDisplay() {
            const time = formatTime(stopwatchTime);
            swDisplay.textContent = time.display;
            swMilliseconds.textContent = `.${time.ms}`;
        }

        function toggleStopwatch() {
            if (stopwatchRunning) {
                // Pause
                clearInterval(stopwatchInterval);
                stopwatchRunning = false;
                swStartPauseBtn.textContent = 'Resume';
                swStartPauseBtn.classList.remove('bg-pink-800', 'text-white', 'hover:bg-pink-300', 'hover:text-black');
                swStartPauseBtn.classList.add('bg-yellow-500', 'hover:bg-green-100', 'hover:text-black');
                swLapBtn.disabled = true;
            } else {
                // Start
                const startTime = Date.now() - stopwatchTime;
                stopwatchInterval = setInterval(() => {
                    stopwatchTime = Date.now() - startTime;
                    updateStopwatchDisplay();
                }, 10); // Update every 10ms for centisecond accuracy
                
                stopwatchRunning = true;
                swStartPauseBtn.textContent = 'Pause';
                swStartPauseBtn.classList.remove('bg-pink-800', 'text-white', 'hover:bg-pink-300', 'hover:text-black');
                swStartPauseBtn.classList.add('bg-pink-800', 'text-white', 'hover:bg-pink-300', 'hover:text-black');
                swResetBtn.disabled = false;
                swLapBtn.disabled = false;
            }
        }

        function resetStopwatch() {
            clearInterval(stopwatchInterval);
            stopwatchRunning = false;
            stopwatchTime = 0;
            laps = [];
            lastLapTime = 0;
            
            updateStopwatchDisplay();
            updateLapsDisplay();

            swStartPauseBtn.textContent = 'Start';
            swStartPauseBtn.classList.remove('bg-yellow-500', 'hover:bg-green-100', 'hover:text-black');
            swStartPauseBtn.classList.add('bg-pink-800', 'text-white', 'hover:bg-pink-300', 'hover:text-black');
            swResetBtn.disabled = true;
            swLapBtn.disabled = true;
        }

        function recordLap() {
            if (!stopwatchRunning) return;

            const lapTime = stopwatchTime - lastLapTime;
            lastLapTime = stopwatchTime;

            const lapNumber = laps.length + 1;
            const lapDisplay = formatTime(lapTime).display;
            const totalDisplay = formatTime(stopwatchTime).display;

            const lapData = {
                number: lapNumber,
                lap: lapDisplay,
                total: totalDisplay
            };

            laps.unshift(lapData); // Add to the beginning
            updateLapsDisplay();
        }

        function updateLapsDisplay() {
            swLapsList.innerHTML = '';
            noLapsMsg.classList.toggle('hidden', laps.length > 0);

            laps.forEach(lap => {
                const li = document.createElement('li');
                li.className = 'chat-container btn flex justify-between items-center text-lg py-2 border-b border-gray-100 last:border-b-0';
                li.innerHTML = `
                    <span class="font-bold text-pink-800 index">Lap ${lap.number}</span>
                    <div class="flex space-x-4">
                        <span class="index font-medium animated-sparkle btnEffect" style="cursor:pointer">${lap.lap}</span>
                        <span class="text-yellow-500 w-24 text-right index">${lap.total}</span>
                    </div>
                `;
                swLapsList.appendChild(li);
            });
        }

        // --- TIMER LOGIC ---

        function updateTimerDisplay() {
            if (timerRemaining < 0) timerRemaining = 0;
            const time = formatTime(timerRemaining);
            tDisplay.textContent = time.display;
        }

        function setTimerFromInputs() {
            const h = parseInt(tHoursInput.value) || 0;
            const m = parseInt(tMinutesInput.value) || 0;
            const s = parseInt(tSecondsInput.value) || 0;

            const totalDuration = (h * 3600 + m * 60 + s) * 1000;
            
            if (totalDuration <= 0) {
                // ERROR PROMPT for 0 duration (when 'Set' is clicked)
                showModal("Error", "The duration must be greater than zero. Please set hours, minutes, or seconds.");
                return;
            }

            // Ensure inputs are clamped
            tHoursInput.value = h;
            tMinutesInput.value = m;
            tSecondsInput.value = s;

            timerDuration = totalDuration;
            timerRemaining = timerDuration;
            timerStatus = TIMER_STATUS.IDLE;
            
            // Clear any running interval
            clearInterval(timerInterval); 
            
            updateTimerDisplay();
            updateTimerControls();
        }

        function toggleTimer() {
            if (timerStatus === TIMER_STATUS.IDLE && timerDuration > 0) {
                startTimer();
            } else if (timerStatus === TIMER_STATUS.RUNNING) {
                pauseTimer();
            } else if (timerStatus === TIMER_STATUS.PAUSED) {
                startTimer();
            } else if (timerStatus === TIMER_STATUS.FINISHED) {
                resetTimer(); // If finished, start button acts as reset/set
            } else if (timerDuration === 0) {
                 // ERROR PROMPT for trying to start before setting time
                 showModal("Error", "Please set the timer duration first using the input fields above.");
            }
        }

        function startTimer() {
            if (timerRemaining <= 0) return;
            
            timerStatus = TIMER_STATUS.RUNNING;
            const startTime = Date.now();
            const initialRemaining = timerRemaining;
            
            tHoursInput.disabled = true;
            tMinutesInput.disabled = true;
            tSecondsInput.disabled = true;
            tSetBtn.disabled = true;

            timerInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                timerRemaining = initialRemaining - elapsed;

                if (timerRemaining <= 0) {
                    timerFinished();
                } else {
                    updateTimerDisplay();
                }
            }, 1000); // Update every 1 second
            
            updateTimerControls();
        }

        function pauseTimer() {
            if (timerStatus !== TIMER_STATUS.RUNNING) return;

            clearInterval(timerInterval);
            timerStatus = TIMER_STATUS.PAUSED;
            updateTimerControls();
        }

        function resetTimer() {
            clearInterval(timerInterval);
            timerRemaining = timerDuration; 
            timerStatus = TIMER_STATUS.IDLE;

            tHoursInput.disabled = false;
            tMinutesInput.disabled = false;
            tSecondsInput.disabled = false;
            tSetBtn.disabled = false;

            updateTimerDisplay();
            updateTimerControls();
        }
        
        function timerFinished() {
            clearInterval(timerInterval);
            timerRemaining = 0;
            timerStatus = TIMER_STATUS.FINISHED;
            updateTimerDisplay();
            updateTimerControls();
            
            // Play the MP3 Alarm
            // Reset to the beginning (important if the timer runs multiple times)
            alarmSound.currentTime = 0; 
            // Loop the sound for continuous alerting until acknowledged
            alarmSound.loop = true; 
            
            alarmSound.play().catch(e => console.warn("Audio playback blocked, please interact with the page first.", e));
            
            // Set the ENDING PROMPT content for timer completion
            modalTitle.textContent = "Time's Up! \u{1F6A8}"; 
            modalMessage.textContent = "Your countdown timer has finished.";
            
            // Ensure the styling is correct for the alarm
            modalTitle.classList.remove('text-blue-600');
            modalTitle.classList.add('text-pink-800');

            openGenericModal();
        }

        function updateTimerControls() {
            const isIdle = timerStatus === TIMER_STATUS.IDLE;
            const isRunning = timerStatus === TIMER_STATUS.RUNNING;
            const isPaused = timerStatus === TIMER_STATUS.PAUSED;
            const isFinished = timerStatus === TIMER_STATUS.FINISHED;
            const hasDuration = timerDuration > 0;
            
            // Start/Pause Button
            if (isRunning) {
                tStartPauseBtn.textContent = 'Pause';
                tStartPauseBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600', 'hover:text-black');
                tStartPauseBtn.classList.add('bg-yellow-500', 'text-black', 'hover:bg-pink-100', 'hover:text-black');
            } else if (isPaused) {
                tStartPauseBtn.textContent = 'Resume';
                tStartPauseBtn.classList.remove('bg-yellow-500', 'text-black', 'hover:bg-pink-100', 'hover:text-black');
                tStartPauseBtn.classList.add('bg-blue-500', 'hover:bg-blue-600', 'hover:text-black');
            } else { // Idle or Finished
                tStartPauseBtn.textContent = 'Start';
                tStartPauseBtn.classList.remove('bg-yellow-500', 'text-black', 'hover:bg-pink-100', 'hover:text-black');
                tStartPauseBtn.classList.add('bg-pink-800', 'text-white', 'hover:bg-pink-300', 'hover:text-black');
            }

            // Reset Button
            tResetBtn.disabled = !hasDuration || isIdle;
            
            // Set Button
            tSetBtn.disabled = isRunning || isPaused;
            
            // Input fields (disabled while running/paused)
            const inputDisabled = isRunning || isPaused;
            tHoursInput.disabled = inputDisabled;
            tMinutesInput.disabled = inputDisabled;
            tSecondsInput.disabled = inputDisabled;
        }


        // --- Modals / Alerts ---
        
        /**
         * Pauses the alarm sound and resets it to the beginning.
         */
        function stopAlarm() {
            alarmSound.pause();
            alarmSound.currentTime = 0;
            alarmSound.loop = false; // Turn off looping
        }

        /**
         * Simple modal for non-critical alerts/errors (re-using the main modal)
         */
        function showModal(title, message) {
            // Set Error message content
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            
            // Styling for Error (usually red)
            modalTitle.classList.remove('text-blue-600');
            modalTitle.classList.add('text-pink-800');
            
            openGenericModal();
        }

        /**
         * Opens the single modal used for both errors and completion.
         */
        function openGenericModal() {
            genericModal.classList.remove('hidden');
            // Force reflow for transition
            requestAnimationFrame(() => {
                genericModal.classList.remove('opacity-0');
                genericModal.querySelector('div').classList.remove('scale-95');
                genericModal.querySelector('div').classList.add('scale-95','alertify');
            });
        }

        /**
         * Closes the single modal used for both errors and completion.
         */
        function closeGenericModal() {
            // Stop the alarm sound when the user acknowledges the modal
            stopAlarm(); 

            genericModal.classList.add('opacity-0');
            genericModal.querySelector('div').classList.remove('scale-100');
            genericModal.querySelector('div').classList.add('scale-95');
            
            setTimeout(() => {
                genericModal.classList.add('hidden');
            }, 300); // Match transition duration
        }
        
        // --- Input Validation (Timer) ---

        // Helper to ensure input fields only accept valid numbers
        function sanitizeInput(e) {
            // Ensure inputs are integers and within valid range (0-99 or 0-59)
            let value = parseInt(e.target.value) || 0;
            let max = e.target.id === 't-hours' ? 99 : 59;
            
            if (value < 0) value = 0;
            if (value > max) value = max;
            
            e.target.value = value;
            
            // When user types, automatically update the display to reflect set time (if not running/paused)
            if (timerStatus === TIMER_STATUS.IDLE) {
                setTimerFromInputs();
            }
        }

        tHoursInput.addEventListener('change', sanitizeInput);
        tMinutesInput.addEventListener('change', sanitizeInput);
        tSecondsInput.addEventListener('change', sanitizeInput);

        // --- Initialization ---
        
        // Function to run after all elements are loaded
        window.onload = function() {
            // 1. Initial setup for timer display (ensures 00:00:00 is shown)
            //setTimerFromInputs(); 
            // 2. Set the initial view to Timer and apply active class
            switchView('timer');
        };
		
function reloadClear() {
  window.localStorage.clear();
  window.location.reload(true);
  return false;
}

<!---POPUP Coustomization---> 
	  function view() {
          alertify.alert(`
            <div style="display:flex; justify-content:center; margin-bottom: 10px;">
                <a href="https://www.linkedin.com/in/sayantan-kundu-52650758" target="_blank">
                    <img src="img/linkedin.png" style="max-width: 100%; max-height: 100%;" alt="LinkedIn"/>
                </a>
            </div>
            <div style="display:flex; justify-content:center; align-items:center; gap: 20px; margin-top: 10px;">
                <a href="https://twitter.com/piklu21" target="_blank">
                    <img src="img/twitter.png" style="width: 150px; height: auto;" alt="Twitter"/>
                </a>
                <a href="https://www.facebook.com/kundupiklu" target="_blank">
                    <img src="img/facebook.jpg" style="width: 150px; height: auto;" alt="Facebook"/> 
                </a>
                <a href="https://www.instagram.com/i_piklu/" target="_blank">
                    <img src="img/instagram.png" style="width: 150px; height: auto;" alt="Instagram"/>
                </a>
            </div>
            <p class="index-alert" style="font-style:italic; font-weight:bolder; font-size:25px;">STAY HOME, STAY SAFE.</p>
            <p class="index-alert" style="font-style:italic; font-weight:bolder; font-size:25px;">#Covid-19 #HomeQuarantine</p>
        `);
          return false;
    }
