const arcCore = document.getElementById('arcCore');
const statusMessage = document.getElementById('statusMessage');
const mapDisplayPanel = document.getElementById('mapDisplayPanel');
const mapFrame = document.getElementById('mapFrame');
const mainHud = document.getElementById('mainHud');
const gpsTelemetry = document.getElementById('gpsTelemetry');
const telemetryLat = document.getElementById('telemetryLat');
const telemetryLon = document.getElementById('telemetryLon');

let isJarvisActive = false;
let isSpeaking = false; 

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    statusMessage.innerText = "Error: Chromium Voice Engine requirements not discovered.";
} else {
    var recognition = new SpeechRecognition();
    recognition.continuous = true; 
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    let isMicrophoneAuthorized = false;
    let isLocationAuthorized = false;

    // Unified Core Activation Sequence
    arcCore.addEventListener('click', async () => {
        if (!isJarvisActive) {
            statusMessage.innerHTML = "<span class='highlight'>REQUESTING MAIN INFRASTRUCTURE PERMISSIONS...</span>";
            await initializeFullSystemAccess();
        } else {
            turnOffJarvis();
        }
    });

    // Master Authorization Handshake
    async function initializeFullSystemAccess() {
        const locationPromise = new Promise((resolve) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        isLocationAuthorized = true;
                        telemetryLat.innerText = position.coords.latitude.toFixed(4);
                        telemetryLon.innerText = position.coords.longitude.toFixed(4);
                        resolve(true);
                    },
                    (error) => {
                        console.warn("Location probe skipped or denied:", error);
                        isLocationAuthorized = false;
                        resolve(false);
                    },
                    { enableHighAccuracy: false, timeout: 3000 }
                );
            } else {
                resolve(false);
            }
        });

        const microphonePromise = new Promise((resolve) => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then((stream) => {
                        isMicrophoneAuthorized = true;
                        stream.getTracks().forEach(track => track.stop());
                        resolve(true);
                    })
                    .catch((error) => {
                        console.warn("Microphone probe refused:", error);
                        isMicrophoneAuthorized = false;
                        resolve(false);
                    });
            } else {
                resolve(false);
            }
        });

        await Promise.all([locationPromise, microphonePromise]);

        if (isMicrophoneAuthorized) {
            isJarvisActive = true;
            arcCore.className = "arc-hologram listening";
            
            let welcomeMessage = "Systems online. All mainstream permissions authorized. I am listening, sir.";
            
            if (!isLocationAuthorized) {
                welcomeMessage = "Systems online, sir. Voice recognition is operational, however telemetry geolocation vectors remain offline.";
                statusMessage.innerHTML = "J.A.R.V.I.S Frame: <span style='color:var(--alert-pink);'>PARTIAL ONLINE</span>";
            } else {
                statusMessage.innerHTML = "J.A.R.V.I.S frame <span class='highlight'>FULL ONLINE</span>. Mainframe operational.";
                gpsTelemetry.style.display = "block";
            }

            speak(welcomeMessage);
        } else {
            statusMessage.innerHTML = "<span style='color:var(--alert-pink);'>CRITICAL ERROR: Mic Access Denied</span>";
            alert("JARVIS requires Microphone permission to function. Please reset site permissions and click the core again.");
        }
    }

    function turnOnJarvis() {
        isJarvisActive = true;
        arcCore.className = "arc-hologram listening";
        statusMessage.innerHTML = "J.A.R.V.I.S <span class='highlight'>ONLINE</span>. Initializing uplink data streaming...";
        speak("Systems online. I am listening, sir.");
    }

    function turnOffJarvis() {
        isJarvisActive = false;
        isSpeaking = false;
        isWaitingForDOB = false;        // Clear state lock loops on manual override
        isWaitingForEquation = false;  // Clear state lock loops on manual override
        arcCore.className = "arc-hologram";
        closeMapHUD();
        try { recognition.stop(); } catch(e){}
        window.speechSynthesis.cancel(); 
        statusMessage.innerText = "Click central core array to initialize diagnostics...";
    }

    recognition.onresult = (event) => {
        if (isSpeaking) return;

        const currentResultIndex = event.resultIndex;
        const speechToText = event.results[currentResultIndex][0].transcript.toLowerCase().trim();
        
        statusMessage.innerHTML = `Matrix incoming payload: <span class='highlight'>"${speechToText}"</span>`;
        
        if (speechToText.includes('shutdown') || speechToText.includes('stop listening') || speechToText.includes('go to sleep')) {
            isSpeaking = true; 
            try { recognition.stop(); } catch(e){}
            arcCore.className = "arc-hologram speaking";

            const goodbyeUtterance = new SpeechSynthesisUtterance("Very well, sir. Powering down systems.");
            goodbyeUtterance.onend = () => { turnOffJarvis(); };
            window.speechSynthesis.speak(goodbyeUtterance);
        } else {
            processCommand(speechToText);
        }
    };

    recognition.onend = () => {
        if (isJarvisActive && !isSpeaking) {
            try { recognition.start(); } catch(e){}
        }
    };
}

function speak(text) {
    if (!isJarvisActive) return;
    isSpeaking = true; 
    arcCore.className = "arc-hologram speaking";
    try { recognition.stop(); } catch(e){} 

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.95; 
    utterance.rate = 1.05;

    utterance.onend = () => {
        setTimeout(() => {
            isSpeaking = false;
            if (isJarvisActive) {
                arcCore.className = "arc-hologram listening";
                try { 
                    recognition.start(); 
                    statusMessage.innerHTML = "System array <span class='highlight'>LISTENING</span>...";
                } catch (e) {}
            }
        }, 300); 
    };
    window.speechSynthesis.speak(utterance);
}

function fetchLiveLocationAndOpenMap() {
    statusMessage.innerHTML = "<span class='highlight'>ISOLATING VOICE THREAD...</span>";

    if (recognition) {
        try { recognition.stop(); } catch(e){}
    }
    
    setTimeout(() => {
        statusMessage.innerHTML = "<span class='highlight'>PINGING GPS NETWORK...</span>";
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                telemetryLat.innerText = lat.toFixed(4);
                telemetryLon.innerText = lon.toFixed(4);
                gpsTelemetry.style.display = "block";

                const label = encodeURIComponent(`${lat}, ${lon}`);
                const mapUrl = `https://maps.google.com/maps?q=${label}&ll=${lat},${lon}&z=15&output=embed`;
                mapFrame.src = mapUrl;

                mapDisplayPanel.style.display = "block";
                setTimeout(() => {
                    mapDisplayPanel.classList.add('show');
                    mainHud.style.transform = "scale(0.85)";
                    mainHud.style.opacity = "0.3";
                }, 50);

                speak("Triangulation complete. Projecting hardware coordinates.");
            }, 
            (error) => {
                console.error("GPS Failure Status:", error);
                speak("I am unable to resolve your coordinate tracking payload, sir.");
                statusMessage.innerHTML = "<span style='color:#ff0055;'>Uplink Interrupted</span>";
                
                if (isJarvisActive) {
                    try { recognition.start(); } catch(e){}
                }
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    }, 400); 
}

function closeMapHUD() {
    mapDisplayPanel.classList.remove('show');
    gpsTelemetry.style.display = "none";
    mainHud.style.transform = "scale(1)";
    mainHud.style.opacity = "1";
    setTimeout(() => {
        mapDisplayPanel.style.display = "none";
        mapFrame.src = ""; 
    }, 400);
}
    
// ----AGE Calculation START        
let isWaitingForDOB = false; 

function processNaturalLanguageDate(spokenText) {
    return chrono.parseDate(spokenText); 
}

function calculatePreciseAge(birthDate) {
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        days += previousMonth;
        months--;
    }
    if (months < 0) {
        months += 12;
        years--;
    }
    return { years, months, days };
}

function runAgeDiagnostic(birthDate) {
    const age = calculatePreciseAge(birthDate);
    statusMessage.innerHTML = `Biometrics computed: <span class='highlight'>${age.years}Y ${age.months}M ${age.days}D</span>`;
    
    let vocalResponse = `Biometric evaluation complete, sir. You are currently ${age.years} years old`;
    if (age.months > 0 || age.days > 0) {
        vocalResponse += `, plus `;
        if (age.months > 0) vocalResponse += `${age.months} ${age.months === 1 ? 'month' : 'months'}`;
        if (age.months > 0 && age.days > 0) vocalResponse += ` and `;
        if (age.days > 0) vocalResponse += `${age.days} ${age.days === 1 ? 'day' : 'days'}`;
    }
    vocalResponse += `. Process completed successfully.`;
    speak(vocalResponse);
}
// ----AGE Calculation END

// ----Equation Calculation START
let isWaitingForEquation = false; 

function runEquationDiagnostic(spokenEquation) {
    let sanitizedEquation = spokenEquation
        .replace(/times/g, '*')
        .replace(/multiply/g, '*')
        .replace(/multiplied by/g, '*')
        .replace(/divided by/g, '/')
        .replace(/divide/g, '/')
        .replace(/plus/g, '+')
        .replace(/minus/g, '-')
        .replace(/into/g, '*')
        .replace(/by/g, '/')
        .replace(/square root of/g, 'sqrt')
        .replace(/power of/g, '^');

    try {
        const result = math.evaluate(sanitizedEquation);
        const cleanResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));
        statusMessage.innerHTML = `Calculation: <span class='highlight'>${cleanResult}</span>`;
        speak(`Computation complete, sir. The total evaluates to ${cleanResult}.`);
    } catch (matrixError) {
        console.error("Math Engine Error:", matrixError);
        statusMessage.innerHTML = `<span style='color: var(--alert-pink);'>Computation Error</span>`;
        speak("Sir, that expression contains mathematical anomalies that my logical framework cannot process.");
    }
}
// ----Equation Calculation End

// ----Picture generation START
async function captureUserSnapshot() {
    // 1. Isolate voice thread to protect local buffers
    if (recognition) {
        try { recognition.stop(); } catch(e){}
    }

    // Spin up dynamic memory layers
    const videoStreamContainer = document.createElement('video');
    const imageProcessingCanvas = document.createElement('canvas');
    const canvasContext = imageProcessingCanvas.getContext('2d');

    try {
        // 2. Request Hardware Interface Access
        const cameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720, facingMode: "user" }, 
            audio: false 
        });

        statusMessage.innerHTML = "<span class='highlight'>OPTICAL UPLINK ACTIVE. FREEZING MATRIX FRAME...</span>";
        
        videoStreamContainer.srcObject = cameraStream;
        videoStreamContainer.autoplay = true;
        videoStreamContainer.playsInline = true;

        // Give the camera sensor a brief 800ms moment to adjust exposure/focus balances
        await new Promise((resolve) => videoStreamContainer.onloadedmetadata = resolve);
        await new Promise((resolve) => setTimeout(resolve, 800));

        // 3. Freeze Frame and Draw to Canvas Dimensions
        imageProcessingCanvas.width = videoStreamContainer.videoWidth;
        imageProcessingCanvas.height = videoStreamContainer.videoHeight;
        canvasContext.drawImage(videoStreamContainer, 0, 0, imageProcessingCanvas.width, imageProcessingCanvas.height);

        // Extract clean Base64 JPEG data string
        const userFacePayload = imageProcessingCanvas.toDataURL('image/jpeg', 0.90);

        // 4. Kill camera hardware stream immediately to secure privacy
        cameraStream.getTracks().forEach(track => track.stop());

        statusMessage.innerHTML = "Capture Array: <span class='highlight'>FRAME LOCKED</span>";
        speak("Capture complete, sir. Projecting image profile telemetry payload.");

        // 5. Fire Alertify HUD Modal Container
        alertify.alert(`
            <div style="text-align:center; padding: 10px; background: rgba(10, 25, 47, 0.95); border: 1px solid var(--highlight); color: #fff;">
                <p style="font-weight: bold; font-size: 1.1rem; letter-spacing: 2px; margin-bottom: 15px; color:#AA205C;">
                    J.A.R.V.I.S IMAGING CORE LOG
                </p>
                
                <div style="border: 2px none; outline:none; border-radius: 4px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 0 15px rgba(170, 32, 92, 0.23);">
                    <img src="${userFacePayload}" style="width: 100%; height: auto; display: block;" alt="User Capture"/>
                </div>
                
                <div style="display: flex; justify-content: center; margin-top: 15px;">
                    <a href="${userFacePayload}" download="jarvis_snapshot_${Date.now()}.jpg" 
                       style="display: inline-block; padding: 10px 25px; background: #AA205C; color: #fff; text-decoration: none; font-weight: bold; border-radius: 3px; font-size: 0.95rem; letter-spacing: 1px; transition: all 0.3s ease;">
                       DOWNLOAD SNAPSHOT
                    </a>
                </div>
                <p style="font-size: 0.75rem; color: #8892b0; margin-top: 10px; font-style: italic;">
                    Click OK below to close the tactical array.
                </p>
            </div>
        `);

    } catch (hardwareError) {
        console.error("Optical Access Failure:", hardwareError);
        statusMessage.innerHTML = "<span style='color:var(--alert-pink);'>Optical Uplink Refused</span>";
        speak("Sir, I was unable to establish a secure link to your camera hardware array.");
    }

    // 6. Safely re-engage JARVIS voice engine ears
    if (isJarvisActive && !isSpeaking) {
        try { recognition.start(); } catch(e){}
    }
}
// ----Picture generation END

// ----ANY URL Website openner START
function launchVoiceUrlRouter(spokenCommand) {
    let cleanText = spokenCommand.toLowerCase().trim();

    // 1. Scrub off all action prefixes and command triggers
    cleanText = cleanText.replace(/^open\s+url\s+/, '')
                         .replace(/^open\s+/, '')
                         .replace(/^go\s+to\s+/, '');

    // 2. Normalize common numerical words transcribed by the voice engine
    const textToDigits = {
        'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
        'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
        
        // CRITICAL VOICE FAULT OVERRIDES
        '18': '118',            // If the engine truncates "one eighteen" down to literal "18"
        'eighteen': '118',      // Explicit text override for port 118 misinterpretations
        'one one eight': '118', // Phased spelling catch
        
        // Standard Port Mapping Matrix
        'three thousand': '3000', 
        'eight thousand': '8000', 
        'eighty eighty': '8080'
    };
    
    Object.keys(textToDigits).forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        cleanText = cleanText.replace(regex, textToDigits[word]);
    });

    // 3. Map spoken port descriptions before processing formatting structures
    cleanText = cleanText.replace(/\s*colon\s*/g, ':')   
                         .replace(/\s*port\s*/g, ':');   

    // 4. Clean up browser voice anomalies, commas, and dots
    let sanitizedUrl = cleanText
        .replace(/\s*dot\s*/g, '.')        // Fixes spaced out dots
        .replace(/comma/g, '.')            // Captures engine verbal pauses
        .replace(/,\s*/g, '.')             
        .replace(/\s+/g, '')               // Slams all remaining spaces shut
        .trim();

    // 5. Fallback: If it doesn't have an extension AND doesn't have a port/localhost setup, append .com
    if (!sanitizedUrl.includes('.') && !sanitizedUrl.includes(':') && !sanitizedUrl.startsWith('localhost')) {
        sanitizedUrl += '.com';
    }

    // 6. Force http:// as the default protocol array
    const finalTargetUrl = sanitizedUrl.startsWith('http') ? sanitizedUrl : 'http://' + sanitizedUrl;

    statusMessage.innerHTML = `Scriptopedia Matrix: <span class='highlight'>LAUNCHING ${sanitizedUrl}...</span>`;
    speak(`Deploying terminal route to ${sanitizedUrl}, sir.`);

    // 7. Fire window frame deployment using your exact presentation parameters
    window.open(finalTargetUrl, '_blank', 'fullscreen,scrollbars');
}
// ----ANY URL Website openner END

// ----NATIVE SYSTEM APPLICATION ROUTER START
function launchLocalSystemApplication(spokenCommand) {
    let appName = spokenCommand.toLowerCase().trim();

    // 1. Scrub off vocal initiation verbs
    appName = appName.replace(/^launch\s+/, '')
                     .replace(/^run\s+/, '')
                     .replace(/^start\s+/, '')
                     .replace(/^open\s+/, '');
	
    // 2. Local OS Universal URI App Protocol Schema Grid
    const systemAppRegistry = {
        'calculator': 'calculator:',
        'calc': 'calculator:',
        'notepad': 'notepad:',
        'terminal': 'cmd:',
        'command prompt': 'cmd:',
        'cmd': 'cmd:',
        'paint': 'ms-paint:',
        'settings': 'ms-settings:',
        'calendar': 'outlookcal:',
		// SECURITY WORKAROUNDS FOR CORE UTILITIES:
        'notepad': 'ms-stickynotes:',   // Opens Windows Sticky Notes (Clean alternative to raw notepad)
        'terminal': 'ms-wpc:',          // Triggers the Windows Shell Execution Parent console
        'command prompt': 'ms-wpc:',
        'cmd': 'ms-wpc:',
		
		// --- Cross-Platform Mobile Apps ---
        'spotify': 'spotify:',
        'discord': 'discord://',
        'whatsapp': 'whatsapp://',
        'youtube': 'youtube://',
        'facebook': 'fb://',
        'twitter': 'twitter://',
        'instagram': 'instagram://',

        // --- Native Android Core Apps (Uses Intent Bypasses) ---
        'phone': 'intent:#Intent;action=android.intent.action.DIAL;end',
        'dialer': 'intent:#Intent;action=android.intent.action.DIAL;end',
        'camera': 'intent:#Intent;action=android.media.action.IMAGE_CAPTURE;end',
        'contacts': 'intent:#Intent;action=android.intent.action.VIEW;category=android.intent.category.DEFAULT;type=vnd.android.cursor.dir/contact;end',
        'messages': 'intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.APP_MESSAGING;end',
        'sms': 'intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.APP_MESSAGING;end'
    };

    // 3. Match checking against standard system designations
    const targetUri = systemAppRegistry[appName];

    if (targetUri) {
        statusMessage.innerHTML = `System Bridge: <span class='highlight'>LAUNCHING native application "${appName}"</span>`;
        speak(`Initializing local kernel protocol for ${appName} now, sir.`);

        // 4. Create an invisible anchor node to trigger the deep-link protocol clean launch
        const securityBypassAnchor = document.createElement('a');
        securityBypassAnchor.href = targetUri;
        
        // Append, trigger click event, and purge node memory trace
        document.body.appendChild(securityBypassAnchor);
        securityBypassAnchor.click();
        document.body.removeChild(securityBypassAnchor);
    } else {
        // Fallback: If it's a niche or custom local path, warn user and pass it to web fallback
        statusMessage.innerHTML = `<span style='color: var(--alert-pink);'>Unknown System URI Mapping</span>`;
        speak(`Sir, I don't have a secure protocol handle mapped for ${appName}. Attempting global web lookup.`);
        
        // Redirect seamlessly into your global fallback logic matrix if deep-link doesn't exist
        const safeSearchQuery = encodeURIComponent(spokenCommand);
        window.open(`https://www.google.com/search?q=${safeSearchQuery}`, '_blank');
    }
}
// ----NATIVE SYSTEM APPLICATION ROUTER END

// ----ALL USER Commands START
function processCommand(command) {
    if (isWaitingForDOB) {
    	const parsedDOB = processNaturalLanguageDate(command);
                
                if (parsedDOB) {
                    const today = new Date();
                    
                    // 1. FUTURE DATE EXCEPTION CHECK
                    if (parsedDOB > today) {
                        statusMessage.innerHTML = `<span style='color: var(--alert-pink);'>CRITICAL ERROR: Temporal Paradox</span>`;
                        speak("Sir, that timestamp registers in a future timeline. My frameworks cannot calculate biometrics for a date that has not occurred. Please state your real birth date.");
                        return; 
                    }

                    isWaitingForDOB = false; // Successfully captured past date, clear the lock flag
                    
                    // Format a clean string for the HUD terminal readout display
                    const readableDate = parsedDOB.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                    statusMessage.innerHTML = `Resolved Target Timestamp: <span class='highlight'>${readableDate}</span>`;
                    
                    // 2. DETECT IF BIRTHDAY IS TODAY
                    const isBirthdayToday = (parsedDOB.getMonth() === today.getMonth() && parsedDOB.getDate() === today.getDate());
                    
                    // Formulate the customized confirmation phrase
                    let confirmationPhrase = `Data match found for ${readableDate}. Synchronizing age diagnostics.`;
                    if (isBirthdayToday) {
                        confirmationPhrase = `Data match found for ${readableDate}. Synchronization complete. And may I say, a very Happy Birthday to you, sir! Projecting your full biometrics now.`;
                    }
                    
                    // Step 1: Speak the confirmation/greeting phrase naturally
                    speak(confirmationPhrase);
                    
                    // Step 2: Active tracking loop to calculate and speak age after confirmation completes
                    const traceAudioCompletion = setInterval(() => {
                        if (!window.speechSynthesis.speaking) {
                            clearInterval(traceAudioCompletion); // Clear tracking loop
                            
                            setTimeout(() => {
                                runAgeDiagnostic(parsedDOB);
                            }, 400);
                        }
                    }, 100);
                    
                } else {
                    statusMessage.innerHTML = `<span style='color: var(--alert-pink);'>Resolution Failure</span>`;
                    speak("I was unable to extrapolate a clean timestamp from that string, sir. Please state your birth date again.");
            }
            return; 
    }
    
    if (isWaitingForEquation) {
        isWaitingForEquation = false; 
        statusMessage.innerHTML = `Analyzing Equation: <span class='highlight'>"${command}"</span>`;
        speak("Parsing mathematical data layout grid.");
        
        const traceMathAudioCompletion = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
                clearInterval(traceMathAudioCompletion);
                setTimeout(() => { runEquationDiagnostic(command); }, 400);
            }
        }, 100);
        return; 
    }

    if (command.includes('hello') || command.includes('wake up')) {
        speak("Hello sir. All operational diagnostics read optimal.");
    } 
    else if (command.includes('time')) {
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        speak(`The current system time is ${time}`);
    }
    else if (command.includes('date') || command.includes('day') || command.includes('what day is it')) {
        const today = new Date();
        const dayName = today.toLocaleDateString([], { weekday: 'long' });
        const dateFormatted = today.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
        const dayNumber = today.getDate();
        let suffix = "th";
        if (dayNumber === 1 || dayNumber === 21 || dayNumber === 31) suffix = "st";
        else if (dayNumber === 2 || dayNumber === 22) suffix = "nd";
        else if (dayNumber === 3 || dayNumber === 23) suffix = "rd";
        
        const monthName = today.toLocaleDateString([], { month: 'long' });
        const yearName = today.getFullYear();
        const spokenText = `Today is ${dayName}, ${monthName} the ${dayNumber}${suffix}, ${yearName}.`;
        
        statusMessage.innerHTML = `Temporal Sync: <span class='highlight'>${dayName}, ${dateFormatted}</span>`;
        speak(spokenText);
    } 
    else if (command.includes('show current location') || command.includes('track location') || command.includes('track my location')) {
        speak("Accessing positioning systems. Checking satellite configuration layout.");
        fetchLiveLocationAndOpenMap();
    }
    else if (command.includes('close location')) {
        speak("De-activating viewport mapping terminal layers.");
        closeMapHUD();
    }
    else if (command.includes('open google')) {
        speak("Opening Google mainframe routing, sir.");
        window.open('https://www.google.com', '_blank');
    }
    else if (command.includes('open youtube')) {
        speak("Connecting to video data pipeline.");
        window.open('https://www.youtube.com', '_blank');
    }
    else if (command.includes('open maps')) {
        speak("Accessing google maps");
        window.open('https://maps.google.com', '_blank', 'fullscreen scrollbar');
    }
	else if (command.includes('open gemini')) {
        speak("Accessing gemini app from web");
        window.open('https://gemini.google.com', '_blank', 'fullscreen scrollbar');
    }
    else if (command.includes('my project page')) {
        speak("Accessing your github page");
        window.open('https://ipiklu.github.io/projects.github.io', '_blank', 'fullscreen scrollbar');
    }
    else if (command.includes('creator') || command.includes('created')) {
        speak("I have Popped creator's social media profiles, please check these out for more information");
        view();
    }
    else if (command.includes('site map')) {
        speak("Accessing project's sitemap page");
        window.open('../../sitemap/index.html', '_blank', 'fullscreen scrollbar');
    }
    else if (command.includes('how old am i') || command.includes('calculate my age') || command.includes('check my age')) {
        speak("Biometric date of birth parameters are not hardcoded into my active runtime arrays. Please state your birth date now, sir.");
        statusMessage.innerHTML = "<span class='highlight'>AWAITING TEMPORAL BIOMETRIC INPUT...</span>";
        isWaitingForDOB = true; 
    }
    else if (command.includes('calculate an equation') || command.includes('calculation') || command.includes('solve math')) {
        speak("Quantifying sandbox arithmetic protocols. State your equation parameters now, sir.");
        statusMessage.innerHTML = "<span class='highlight'>AWAITING MATHEMATICAL MATRIX VALUES...</span>";
        isWaitingForEquation = true; 
    }
	else if (
		command.startsWith('open url ') || 
		command.startsWith('open ') || 
		command.startsWith('go to ') || 
		/\.[a-z]{2,6}/i.test(command) || // Instantly catches direct domains like "google.com"
		command.includes('dot com') || 
		command.includes('dot org') || 
		command.includes('dot net')
	) {
		launchVoiceUrlRouter(command);
	}
	else if (
        command.startsWith('launch ') || 
        command.startsWith('run ') || 
        command.startsWith('start ') ||
        command.includes('open terminal') ||
        command.includes('open calculator') ||
        command.includes('open notepad')
    ) {
        launchLocalSystemApplication(command);
    }
	else if (command.includes('take a photo') || command.includes('capture me') || command.includes('open camera')) {
                speak("Accessing optical sensors. Stand by for frame capture.");
                statusMessage.innerHTML = "<span class='highlight'>INITIALIZING OPTICAL SCANNER...</span>";
                
                // Stagger slightly for dramatic vocal effect
                setTimeout(() => {
                    captureUserSnapshot();
                }, 2500);
    }
    // FIX APPLIED BELOW: Blocks feedback loops during voice-to-redirection sequences
    else if (command.includes('previous menu') || command.includes('previous menu page')) {
        isSpeaking = true;
        try { recognition.stop(); } catch(e){}
        speak("Good bye sir, see you soon.");
        setTimeout(() => {
            window.location.href = "../server/index.html";
        }, 3000);
    }
    else if (command.includes('main menu') || command.includes('main menu page')) {
        isSpeaking = true;
        try { recognition.stop(); } catch(e){}
        speak("Good bye sir, navigating to main menu.");
        setTimeout(() => {
            window.location.href = "../../index.html";
        }, 3000);
    }
	else if (command.includes('commands') || command.includes('what can you do')) {
        speak("I have Popped the commands that can be given to me or I can answer, Please check and ask me.");
        commadsView();
    }
    else {
        // GLOBAL GOOGLE SEARCH FALLBACK MATRIX
        statusMessage.innerHTML = `Searching Matrix: <span class='highlight'>"${command}"</span>`;
        speak(`No direct routing matched, sir. Initiating a global Google search for ${command}.`);
        
        // Encode the spoken text string into a web-safe query parameter
        const safeSearchQuery = encodeURIComponent(command);
        const searchUrl = `https://www.google.com/search?q=${safeSearchQuery}`;
        
        // Deploy the search interface using your exact presentation parameters
        window.open(searchUrl, '_blank', 'fullscreen scrollbar');
    }
}
// ----ALL USER Commands END