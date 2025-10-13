// JavaScript Document

        // Global variables for Firebase access (required by platform)
        // These are not used for this simple calculator, but included as per standard instruction.
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

        const wheels = {
            day: document.getElementById('day-wheel'),
            month: document.getElementById('month-wheel'),
            year: document.getElementById('year-wheel'),
        };

        const containers = {
            day: document.getElementById('day-container'),
            month: document.getElementById('month-container'),
            year: document.getElementById('year-container'),
        };

        const ageText = document.getElementById('age-text');
        const fullDetails = document.getElementById('full-details');

        const ITEM_HEIGHT = 48; // Corresponds to Tailwind h-12
        const CENTER_OFFSET = 96; // 2 * ITEM_HEIGHT (distance from top of scroll container to the center line)

        // State to hold the selected date components
        let selectedDate = {
            day: 1,
            month: 0, // 0-indexed for JavaScript Date object
            year: new Date().getFullYear(),
        };
        
        // --- Audio Initialization (Tone.js) ---
        let synth; // Stays undefined until the first user interaction
        let lastScrollTick = { day: 0, month: 0, year: 0 };

        /**
         * Initializes the Tone.js audio context and synth object on user interaction.
         */
        function enableSound() {
            if (Tone.context.state !== 'running') {
                Tone.start().then(() => {
                    if (!synth) {
                         // New parameters for a sharp, high-pitched clock tick
                         synth = new Tone.MembraneSynth({
                            pitchDecay: 0.005,
                            octaves: 0.5,
                            envelope: {
                                attack: 0.0001,
                                decay: 0.02,
                                sustain: 0,
                                release: 0.01
                            }
                        }).toDestination();
                        console.log("Audio context started on first interaction.");
                    }
                }).catch(error => {
                    console.error("Failed to start audio context on interaction:", error);
                });
            }
        }

        /**
         * Plays the custom click sound if audio is enabled (i.e., synth is defined).
         */
        function playClickSound() {
            if (synth) { 
                synth.triggerAttackRelease("A6", "64n");
            }
        }

        // --- 1. Date Data Generation ---

        const MONTH_NAMES = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        
        const days = Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: (i + 1).toString() }));
        const months = MONTH_NAMES.map((name, index) => ({ value: index, label: name }));

        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: currentYear - 100 + 1 }, (_, i) => ({ 
            value: 100 + i, 
            label: (100 + i).toString() 
        })).reverse();

        // --- 2. Rendering and Initialization ---

        /**
         * Renders the list items into a wheel container.
         * @param {HTMLElement} container The DOM element to append items to.
         * @param {Array<Object>} items The list of {value, label} objects.
         * @param {string} type 'day', 'month', or 'year'.
         */
        function renderWheel(container, items, type) {
            container.innerHTML = '';
            items.forEach(item => {
                const div = document.createElement('div');
                // Removed dark mode text color class
                div.className = 'wheel-item flex items-center justify-center h-12 text-xl text-gray-700';
                div.textContent = item.label;
                div.dataset.value = item.value;
                div.dataset.type = type;
                container.appendChild(div);
            });
        }

        renderWheel(containers.day, days, 'day');
        renderWheel(containers.month, months, 'month');
        renderWheel(containers.year, years, 'year');


        // --- 3. Wheel Selection and Snapping Logic ---

        /**
         * Updates the visual styles of items based on their distance from the center.
         */
        function updateWheelState(wheel, type) {
            const scrollTop = wheel.scrollTop;
            let closestItem = null;
            let minDistance = Infinity;
            const items = wheel.querySelector('.wheel-container').children;

            Array.from(items).forEach(item => {
                const itemTopRelativeToContainer = item.offsetTop;
                const distanceToCenterLine = Math.abs(itemTopRelativeToContainer - scrollTop - CENTER_OFFSET);

                // Visual Fading/Scaling (based on proximity)
                const distanceInUnits = distanceToCenterLine / ITEM_HEIGHT;
                const scale = Math.max(0.85, 1.0 - (distanceInUnits * 0.075));
                const opacity = Math.max(0.4, 1.0 - (distanceInUnits * 0.15));

                item.style.transform = `scale(${scale})`;
                item.style.opacity = opacity;

                // Selection Logic
                if (distanceToCenterLine < minDistance) {
                    minDistance = distanceToCenterLine;
                    closestItem = item;
                }

                item.classList.remove('selected');
            });

            if (closestItem) {
                closestItem.classList.add('selected');
                const newValue = parseInt(closestItem.dataset.value);
                
                if (selectedDate[type] !== newValue) {
                    selectedDate[type] = newValue;
                    calculateAge();
                }
            }
        }

        /**
         * Helper function for Dark Mode cleanup - now empty/removed
         */
        function updateAllWheelVisuals() {
            // Function content removed as it was only needed for dark mode updates.
        }

        // --- 4. Age Calculation Logic ---

        /**
         * Determines the Zodiac sign based on the birth month and day.
         * Month is 0-indexed (0=Jan, 11=Dec).
         */
        function getZodiacSign(month, day) {
            if ((month === 11 && day >= 22) || (month === 0 && day <= 19)) return "Capricorn ♑";
            if ((month === 0 && day >= 20) || (month === 1 && day <= 18)) return "Aquarius ♒";
            if ((month === 1 && day >= 19) || (month === 2 && day <= 20)) return "Pisces ♓";
            if ((month === 2 && day >= 21) || (month === 3 && day <= 19)) return "Aries ♈";
            if ((month === 3 && day >= 20) || (month === 4 && day <= 20)) return "Taurus ♉";
            if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) return "Gemini ♊";
            if ((month === 5 && day >= 21) || (month === 6 && day <= 22)) return "Cancer ♋";
            if ((month === 6 && day >= 23) || (month === 7 && day <= 22)) return "Leo ♌";
            if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Virgo ♍";
            if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Libra ♎";
            if ((month === 9 && day >= 23) || (month === 10 && day <= 21)) return "Scorpio ♏";
            if ((month === 10 && day >= 22) || (month === 11 && day <= 21)) return "Sagittarius ♐";
            return "Unknown Sign";
        }

        function calculateAge() {
            const today = new Date();
            const todayYear = today.getFullYear();
            const todayMonth = today.getMonth(); // 0-11
            const todayDay = today.getDate(); // 1-31

            const birthDate = new Date(selectedDate.year, selectedDate.month, selectedDate.day);
            const birthYear = birthDate.getFullYear();
            const birthMonth = birthDate.getMonth();
            const birthDay = birthDate.getDate();
            
            let ageYears = todayYear - birthYear;
            
            if (todayMonth < birthMonth || (todayMonth === birthMonth && todayDay < birthDay)) {
                ageYears--;
            }

            let ageMonths = todayMonth - birthMonth;
            if (ageMonths < 0) {
                ageMonths += 12;
            }

            let ageDays = todayDay - birthDay;
            if (ageDays < 0) {
                ageMonths--;
                if (ageMonths < 0) {
                    ageMonths += 12;
                }
                
                const daysInLastMonth = new Date(todayYear, todayMonth, 0).getDate();
                ageDays += daysInLastMonth;
            }
            
            const zodiacSign = getZodiacSign(birthMonth, birthDay);

            if (ageYears < 0) {
                ageText.textContent = "Future Date";
                fullDetails.textContent = "Please select a date in the past.";
                return;
            }

            ageText.textContent = `${ageYears} years old`;
            fullDetails.textContent = 
                `Zodiac: ${zodiacSign} | ${ageMonths} months and ${ageDays} days since last birthday.`;
        }

        // --- 5. Event Listeners and Scroll Snapping ---

        const scrollDebounceTimers = {};

        /**
         * Forces the nearest item to snap into the center position.
         */
        function snapScroll(wheel, type) {
            const items = wheel.querySelector('.wheel-container').children;
            let closestItem = null;
            let minDistance = Infinity;
            let snapPosition = 0;

            Array.from(items).forEach(item => {
                const distance = Math.abs(item.offsetTop - wheel.scrollTop - CENTER_OFFSET);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestItem = item;
                }
            });

            if (closestItem) {
                snapPosition = closestItem.offsetTop - CENTER_OFFSET;

                wheel.scrollTo({
                    top: snapPosition,
                    behavior: 'smooth'
                });
                
                updateWheelState(wheel, type);
            }
        }
        
        /**
         * Listener for scroll events, debounces the snap action.
         */
        function handleScroll(event, type) {
            enableSound(); 
            
            const wheel = event.target;
            const scrollTop = wheel.scrollTop;
            
            // 1. Update visual state immediately
            updateWheelState(wheel, type); 
            
            // 2. Sound Logic
            const currentTick = Math.round(scrollTop / ITEM_HEIGHT);

            if (currentTick !== lastScrollTick[type]) {
                lastScrollTick[type] = currentTick;
                playClickSound(); // Play sound on tick
            }

            // 3. Debounce scroll snapping
            if (scrollDebounceTimers[type]) {
                clearTimeout(scrollDebounceTimers[type]);
            }

            scrollDebounceTimers[type] = setTimeout(() => {
                snapScroll(wheel, type);
            }, 200);
        }

        // Attach listeners to all wheels
        wheels.day.addEventListener('scroll', (e) => handleScroll(e, 'day'));
        wheels.month.addEventListener('scroll', (e) => handleScroll(e, 'month'));
        wheels.year.addEventListener('scroll', (e) => handleScroll(e, 'year'));
        
        // --- 6. Dark Mode Logic Removed ---


        // --- 7. Initial Setup ---

        function initializeApp() {
            // Dark mode initialization removed, setting app to light theme default

            // Set initial state to today's date (or a sensible default like 20 years ago)
            const today = new Date();
            selectedDate.day = today.getDate();
            selectedDate.month = today.getMonth();
            selectedDate.year = today.getFullYear() - 20; // Default to 20 years ago

            // Find the initial items to center them in the wheels
            const initialSnap = (type, value) => {
                const wheel = wheels[type];
                const items = wheel.querySelector('.wheel-container').children;
                const targetItem = Array.from(items).find(item => parseInt(item.dataset.value) === value);
                
                if (targetItem) {
                    const snapPosition = targetItem.offsetTop - CENTER_OFFSET;
                    wheel.scrollTo({ top: snapPosition, behavior: 'instant' });
                    // Explicitly update state after the initial scroll
                    updateWheelState(wheel, type);
                }
            };

            // Initialize the wheels to the default date
            initialSnap('day', selectedDate.day);
            initialSnap('month', selectedDate.month);
            initialSnap('year', selectedDate.year);
            
            // Perform the initial age calculation
            calculateAge();
        }

        window.onload = initializeApp;
		
		
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