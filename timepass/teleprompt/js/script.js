// JavaScript Document
// Global state
const state = {
    mediaRecorder: null,
    recordedChunks: [],
    scrollInterval: null,
    scrollSpeed: 5,
    isScrolling: false,
    stream: null,
    videoBlob: null,
    isRecording: false,
    recordedMimeType: 'video/mp4',
    // --- NEW STATE VARIABLES FOR TIMER ---
    countdownTimer: null,
    recordTimerInterval: null,
    recordStartTime: 0,
    elapsedTime: 0,
};

// DOM Elements
const D = {
    videoPreview: document.getElementById('video-preview'),
    teleprompterContent: document.getElementById('teleprompter-content'),
    scriptEditor: document.getElementById('script-editor'),
    scrollWrapper: document.getElementById('scroll-wrapper'),
    updateScriptBtn: document.getElementById('update-script-btn'),
    scrollSpeedInput: document.getElementById('scroll-speed'),
    speedValue: document.getElementById('speed-value'),
    messageBox: document.getElementById('message-box'),
    toggleModeBtn: document.getElementById('toggle-mode-btn'),
    videoTeleprompterView: document.getElementById('video-teleprompter-view'),

    // Controls
    openControlsBtn: document.getElementById('open-controls-btn'),
    closeControlsBtn: document.getElementById('close-controls-btn'),
    controlsModal: document.getElementById('controls-modal'),
    recordBtn: document.getElementById('record-btn'),
    recordIcon: document.getElementById('record-icon'),
    downloadFabBtn: document.getElementById('download-fab-btn'),
    downloadModal: document.getElementById('download-modal'),
    downloadLink: document.getElementById('download-link'),
    closeDownloadBtn: document.getElementById('close-download-btn'),
    
    // Instruction Elements
    instructionOverlay: document.getElementById('instruction-overlay'),
    instructionText: document.getElementById('instruction-text'),

    // --- NEW DOM REFERENCE FOR TIMER ---
    timerDisplay: document.getElementById('timer-display'), 
};

const API_KEY = ""; // Using empty API key as instructed

/** Utility function to show custom alerts */
function showMessage(text, duration = 3000) {
    D.messageBox.textContent = text;
    D.messageBox.classList.remove('hidden');
    setTimeout(() => {
        D.messageBox.classList.add('hidden');
    }, duration);
}

/** * Modal Toggle Functions (Omitted content) */
function toggleControlsModal(show) {
    if (show) {
        D.downloadModal.classList.add('hidden'); 
        D.downloadModal.classList.remove('flex'); 
        D.controlsModal.classList.remove('hidden');
        D.controlsModal.classList.add('flex'); 
    } else {
        D.controlsModal.classList.add('hidden');
        D.controlsModal.classList.remove('flex'); 
    }
}

function toggleDownloadModal(show) {
    if (show) {
        D.controlsModal.classList.add('hidden');
        D.controlsModal.classList.remove('flex'); 
        D.downloadModal.classList.remove('hidden');
        D.downloadModal.classList.add('flex'); 
    } else {
        D.downloadModal.classList.add('hidden');
        D.downloadModal.classList.remove('flex'); 
    }
}

/** Video Stream Initialization */
async function initCamera() {
    D.messageBox.textContent = "Requesting camera and microphone access...";
    try {
        // Get both video and audio stream
        state.stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: true
        });

        D.videoPreview.srcObject = state.stream;
        D.videoPreview.onloadedmetadata = () => {
            D.videoPreview.play();
        };

        D.messageBox.classList.add('hidden');
        D.recordBtn.disabled = false;
        D.recordBtn.title = "Start Recording";
        showMessage("Camera ready. Press the red button to record.", 2500);

    } catch (err) {
        console.error("Error accessing media devices:", err);
        D.messageBox.textContent = "Error: Could not access camera/mic. Please check permissions.";
        D.recordBtn.disabled = true;
        D.recordBtn.title = "Camera Access Required";
    }
}

/** Teleprompter Scrolling Logic (Omitted content) */
function updateScrollSpeed(value) {
    state.scrollSpeed = parseInt(value);
    D.speedValue.textContent = value;

    if (state.isScrolling) {
        clearInterval(state.scrollInterval);
        state.scrollInterval = null; 
        startScrolling();
    }
}

/** Stop Scrolling Function: Accepts a boolean to indicate if the script finished naturally */
function stopScrolling(finished = false) {
    if (state.scrollInterval) {
        clearInterval(state.scrollInterval);
        state.scrollInterval = null;
        state.isScrolling = false;
        
        // Show instruction overlay with pause/finish message
        D.instructionText.textContent = finished ? "SCRIPT FINISHED. PRESS RECORD TO RESTART." : "PAUSED. CLICK TO RESUME.";
        D.instructionOverlay.classList.remove('hidden-overlay');
        console.log(`[TELEPROMPTER] Scrolling ${finished ? 'finished' : 'stopped/paused'}.`);
    }
}

/** Start Scrolling Function (Single-Run Mode) */
function startScrolling() {
    if (state.isScrolling) return; // Prevent double starting
    
    // maxScroll is the maximum scroll position (scrollHeight - clientHeight)
    const maxScroll = D.teleprompterContent.scrollHeight - D.scrollWrapper.clientHeight;
    
    if (maxScroll <= 0) {
        console.warn("[TELEPROMPTER] Scroll not possible: Content is not long enough to overflow the container. maxScroll:", maxScroll);
        showMessage("Script is too short to scroll. Add more content!", 5000);
        return; 
    }
    
    console.log(`[TELEPROMPTER] Starting single-run scroll. Max scroll available: ${maxScroll}.`);

    state.isScrolling = true;
    // Hide instruction overlay
    D.instructionOverlay.classList.add('hidden-overlay');
    
    // Calculate scroll step based on screen height and speed input (1-20)
    const scrollStep = Math.max(1, state.scrollSpeed * 0.5); // 0.5px to 10px per frame

    state.scrollInterval = setInterval(() => {
        let currentScroll = D.scrollWrapper.scrollTop;

        if (currentScroll + scrollStep >= maxScroll) {
            // Reached Bottom: Stop scrolling for single-run mode
            D.scrollWrapper.scrollTop = maxScroll; // Ensure it hits the exact bottom
            stopScrolling(true); // Pass true to signal finished, not paused
            showMessage("Script finished rolling.", 1500); 
        } else {
            // Scroll normally down
            D.scrollWrapper.scrollTop += scrollStep;
        }
    }, 30); 
}


/** Handle click on scroll area for PAUSE/RESUME */
window.handleScrollClick = function() {
    // Only allow manual pause/resume if recording is active or has started once
    if (!state.isRecording && D.scrollWrapper.scrollTop === 0) {
        showMessage("Press the red button to start recording and scrolling.", 2000);
        return;
    }

    if (state.isScrolling) {
        stopScrolling(); // Manual pause
    } else {
        // Only resume if it's currently paused, not finished
        if (D.instructionText.textContent.includes("PAUSED")) {
            startScrolling(); // Resume
        } else {
            showMessage("Script finished. Press the red button to reset and record again.", 2000);
        }
    }
}

// --- NEW TIMER UTILITY FUNCTIONS ---

/** Formats seconds into MM:SS or HH:MM:SS string */
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const pad = (num) => String(num).padStart(2, '0');

    if (hours > 0) {
        return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
}

/** Updates the display with the elapsed recording time */
function updateRecordTimer() {
    state.elapsedTime = Math.floor((Date.now() - state.recordStartTime) / 1000);
    D.timerDisplay.textContent = formatTime(state.elapsedTime);
}

/** Starts the recording stopwatch */
function startRecordTimer() {
    state.recordStartTime = Date.now();
    D.timerDisplay.classList.remove('hidden');
	
	// REMOVE THE CENTERING CLASS FOR DURATION TIMER (It will default back to 'top-4' from HTML)
    D.timerDisplay.classList.remove('countdown-center');
	
    // Ensure large text is removed and small text is added for the duration
    D.timerDisplay.classList.remove('text-5xl', 'font-bold'); 
    D.timerDisplay.classList.add('text-lg', 'font-normal'); 
    D.timerDisplay.textContent = formatTime(0);
    state.recordTimerInterval = setInterval(updateRecordTimer, 1000);
    console.log("[RECORDER] Recording timer started.");
}

/** Stops the recording stopwatch */
function stopRecordTimer() {
    clearInterval(state.recordTimerInterval);
    state.recordTimerInterval = null;
    D.timerDisplay.classList.add('hidden');
	
    // Using console.log since D.log is not defined
    console.log(
        "[RECORDER] Recording timer stopped. Total Duration: " +
        formatTime(state.elapsedTime)
    );
}

/** Starts the 5-second countdown */
function startCountdown() {
    // If a countdown is already running, prevent starting another
    if (state.countdownTimer) return;

    let count = 5;
    D.timerDisplay.classList.remove('hidden');
	
	// ADD THE CENTERING CLASS FOR COUNTDOWN
    D.timerDisplay.classList.add('countdown-center');
	
    // Reset classes for the large countdown display
    D.timerDisplay.classList.remove('text-lg', 'font-normal'); 
    D.timerDisplay.classList.add('text-5xl', 'font-bold'); 
    D.timerDisplay.textContent = count;
    D.recordBtn.disabled = true; // Disable button during countdown

    // Hide instruction text during countdown
    D.instructionOverlay.classList.add('hidden-overlay');

    showMessage(`Recording starting in ${count} seconds...`, 1500);

    state.countdownTimer = setInterval(() => {
        count--;
        D.timerDisplay.textContent = count > 0 ? count : "GO!";

        if (count < 0) {
            clearInterval(state.countdownTimer);
            state.countdownTimer = null;
            D.recordBtn.disabled = false; // Re-enable the button
            
            // Now, officially start the recording after countdown
            startRecording(); 
        } else if (count === 0) {
            showMessage("Recording in progress!", 1000);
        }

    }, 1000);
}

// --- RECORDING FUNCTIONS ---

/** Handles the toggle button, now initiates the countdown */
function handleRecordToggle() {
    if (state.isRecording) {
        stopRecording();
    } else {
        startCountdown();
    }
}

/** Core logic to start recording, called after the countdown finishes */
function startRecording() { 
    if (!state.stream) {
        showMessage("Error: Camera stream not available.", 3000);
        return;
    }
    
    // 1. Clean Scroll State 
    stopScrolling(); 
    D.scrollWrapper.scrollTop = 0; 
    
    state.recordedChunks = [];
    
    // --- MEDIA RECORDER SETUP ---
    const mimeTypeMP4 = 'video/mp4; codecs="avc1.64001f, mp4a.40.2"';
    const mimeTypeWebM = 'video/webm';

    try {
        // 1. Attempt MP4 format
        state.mediaRecorder = new MediaRecorder(state.stream, {
            mimeType: mimeTypeMP4
        });
        state.recordedMimeType = mimeTypeMP4; 
        console.log(`[RECORDER] Attempting: ${mimeTypeMP4}`);

    } catch (e) {
        console.warn(`[RECORDER] MP4 codecs failed: ${e.message}. Attempting WebM fallback.`);
        try {
            // 2. Fallback to WebM
            state.mediaRecorder = new MediaRecorder(state.stream, {
                mimeType: mimeTypeWebM
            });
            state.recordedMimeType = mimeTypeWebM; 
            showMessage("Error starting MP4 recording. Switched to WebM format for compatibility.", 5000);
            console.log(`[RECORDER] Using fallback: ${mimeTypeWebM}`);

        } catch (e2) {
            console.error('[RECORDER] WebM MediaRecorder also failed:', e2);
            showMessage("Error: Cannot start recording on this device.", 5000);
            return; // Stop execution if both failed
        }
    }

    // Common setup after MediaRecorder is successfully created
    state.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            state.recordedChunks.push(event.data);
        }
    };

    state.mediaRecorder.onstop = handleStopRecording;

    // --- END MEDIA RECORDER SETUP ---

    state.mediaRecorder.start();
    state.isRecording = true;

    // --- NEW: Start the recording stopwatch ---
    startRecordTimer(); 
    // ------------------------------------------
    
    // UI updates for recording start
    D.recordBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
    D.recordBtn.classList.add('bg-gray-500', 'hover:bg-gray-600');
    D.recordIcon.innerHTML = `<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none"/>`; 
    D.recordBtn.title = "Stop Recording";
    
    // 2. Start scrolling with recording
    startScrolling();
    showMessage(`Recording and single-run rolling started! Format attempt: ${state.recordedMimeType.includes('mp4') ? 'MP4' : 'WebM'}`, 4000);
}
    
function stopRecording() {
    if (state.mediaRecorder && state.isRecording) {
        state.mediaRecorder.stop();
        stopScrolling();
        state.isRecording = false;

        // --- NEW: Stop the recording stopwatch ---
        stopRecordTimer();
        // ------------------------------------------
        
        // UI updates (Remains the same)
        D.recordBtn.classList.remove('bg-gray-500', 'hover:bg-gray-600');
        D.recordBtn.classList.add('bg-red-600', 'hover:bg-red-700');
        D.recordIcon.innerHTML = `<circle cx="12" cy="12" r="8"/>`; 
        D.recordBtn.title = "Start Recording";
        
        showMessage("Processing video...", 2000);
    }
}

// --- FILENAME GENERATION ---
    const now = new Date();
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", 
                        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const pad = (num) => num.toString().padStart(2, '0');
    const day = pad(now.getDate());
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    const filename = `${day}${month}${year}_${hours}${minutes}${seconds}`;
// --- FILENAME GENERATION (END) ---	

function handleStopRecording() {
    // IMPORTANT FIX: Use the determined MIME type for the Blob creation to ensure the file structure is correct.
    state.videoBlob = new Blob(state.recordedChunks, { type: state.recordedMimeType }); 
    const videoUrl = URL.createObjectURL(state.videoBlob);
    
    // Determine the file extension based on the actual recorded MIME type
    const fileExtension = state.recordedMimeType.includes('mp4') ? 'mp4' : 'webm';
    
    // Show download link and open download modal
    D.downloadLink.href = videoUrl;
    // Set the correct download filename and extension
    D.downloadLink.download = `teleprompter_video_${filename}.${fileExtension}`;

    D.downloadFabBtn.classList.remove('hidden');
    // Ensure only the download modal opens, and that the controls modal is closed
    toggleDownloadModal(true); 

    showMessage(`Recording processed. File format: ${fileExtension.toUpperCase()}`, 3000);
}
    
/** Event Handlers */
function handleUpdateScript() {
    const script = D.scriptEditor.value.trim();
    D.teleprompterContent.textContent = script;
    // Reset scroll position to the top
    D.scrollWrapper.scrollTop = 0;
    stopScrolling(); // Clears any active interval
    
    // Ensure instruction overlay is visible and correct after script update/reset
    D.instructionOverlay.classList.remove('hidden-overlay');
    
    showMessage("Script updated and teleprompter reset.", 1500);
}

function handleToggleMode() {
    // Toggle between camera view and plain black screen (useful for professional teleprompter setups)
    D.videoPreview.classList.toggle('hidden');
    
    const isVideoHidden = D.videoPreview.classList.contains('hidden');
    const modeText = isVideoHidden ? "Black Screen Mode (Video OFF)" : "Camera Mode (Video ON)";
    showMessage(modeText, 2500);
    D.toggleModeBtn.textContent = isVideoHidden ? "Toggle Camera ON" : "Toggle Black Background Mode";
}

/** Initialization and Event Listener Setup */
function setupEventListeners() {
    // 1. Initial State Setup: Ensure both modals are hidden on load.
    D.controlsModal.classList.add('hidden');
    D.controlsModal.classList.remove('flex');
    D.downloadModal.classList.add('hidden');
    D.downloadModal.classList.remove('flex');
    
    // 2. Modal Backdrop Clicks (Close on clicking outside content)
    D.controlsModal.addEventListener('click', (e) => {
        if (e.target === D.controlsModal) toggleControlsModal(false);
    });
    D.downloadModal.addEventListener('click', (e) => {
        if (e.target === D.downloadModal) toggleDownloadModal(false);
    });


    // 3. Open/Close Buttons
    D.openControlsBtn.addEventListener('click', () => toggleControlsModal(true));
    D.closeControlsBtn.addEventListener('click', () => toggleControlsModal(false));
    D.recordBtn.addEventListener('click', handleRecordToggle);
    D.downloadFabBtn.addEventListener('click', () => toggleDownloadModal(true));
    D.closeDownloadBtn.addEventListener('click', () => toggleDownloadModal(false));

    D.updateScriptBtn.addEventListener('click', handleUpdateScript);
    
    D.scrollSpeedInput.addEventListener('input', (e) => {
        updateScrollSpeed(e.target.value);
    });

    D.toggleModeBtn.addEventListener('click', handleToggleMode);

    // Initialize teleprompter content and set the initial prompt
    handleUpdateScript(); 
}

// Main setup function
window.onload = () => {
    setupEventListeners();
    initCamera();
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