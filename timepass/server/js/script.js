// JavaScript Document

document.addEventListener("DOMContentLoaded", () => {
    const darkModeCheckbox = document.getElementById("dark-mode");

    // Check if a theme preference is already saved
    const savedDarkMode = localStorage.getItem("darkModeEnabled");

    if (savedDarkMode === "true") {
        darkModeCheckbox.checked = true;
        document.body.classList.add("dark-theme");
    } else if (savedDarkMode === "false") {
        darkModeCheckbox.checked = false;
        document.body.classList.remove("dark-theme");
    } else {
        // Fallback to device system preference
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            darkModeCheckbox.checked = true;
            document.body.classList.add("dark-theme");
        }
    }

    // Toggle theme updates on user interaction
    darkModeCheckbox.addEventListener("change", () => {
        if (darkModeCheckbox.checked) {
            document.body.classList.add("dark-theme");
            localStorage.setItem("darkModeEnabled", "true");
        } else {
            document.body.classList.remove("dark-theme");
            localStorage.setItem("darkModeEnabled", "false");
        }
    });
});

        // Get the globe element
        const globe = document.getElementById('globe');

        // State variables for tracking rotation
        let isDragging = false;
        let lastX = 0;
        let lastY = 0;
        let rotY = 0;
        let rotX = 0;
        let velX = 0;
        let velY = 0;
        
        // Define rotation speed sensitivity
        const sensitivity = 0.8;

        // The single animation loop that applies all rotation
        function animate() {
            // Apply rotation based on current velocity
            rotY += velX;
            rotX += velY;

            // Apply the new rotation to the globe element
            globe.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;

            // Request the next frame only if dragging
            if (isDragging) {
                requestAnimationFrame(animate);
            }
        }
        
        // --- Mouse Event Handlers ---
        globe.addEventListener('mousedown', (e) => {
            isDragging = true;
            globe.style.cursor = 'grabbing';
            // Stop existing spin and set start position
            velX = 0;
            velY = 0;
            lastX = e.clientX;
            lastY = e.clientY;
            // Start the animation loop when dragging begins
            requestAnimationFrame(animate);
        });

        globe.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            // Calculate velocity based on change in mouse position
            const deltaX = e.clientX - lastX;
            const deltaY = e.clientY - lastY;
            
            // Directly set velocity for immediate feedback
            velX = deltaX * sensitivity;
            velY = -deltaY * sensitivity; // Invert Y-axis for natural feel
            
            // Update last position for the next frame's velocity calculation
            lastX = e.clientX;
            lastY = e.clientY;
        });

        globe.addEventListener('mouseup', () => {
            isDragging = false;
            globe.style.cursor = 'grab';

            // Stop the animation loop by not requesting a new frame
            velX = 0;
            velY = 0;
        });

        globe.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                globe.style.cursor = 'grab';
                // Stop the animation loop by not requesting a new frame
                velX = 0;
                velY = 0;
            }
        });

        // --- Touch Event Handlers for Mobile ---
        globe.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                velX = 0;
                velY = 0;
                lastX = e.touches[0].clientX;
                lastY = e.touches[0].clientY;
                requestAnimationFrame(animate);
            }
        });

        globe.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length !== 1) return;
            e.preventDefault();

            const deltaX = e.touches[0].clientX - lastX;
            const deltaY = e.touches[0].clientY - lastY;

            velX = deltaX * sensitivity;
            velY = -deltaY * sensitivity;

            lastX = e.touches[0].clientX;
            lastY = e.touches[0].clientY;
        });

        globe.addEventListener('touchend', () => {
            isDragging = false;
            velX = 0;
            velY = 0;
        });

<!---App download Dropdown--->	
function appDownload() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn') && !event.target.closest('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}	
<!---App download Dropdown--->
		
function reloadClear() {
    // 1. Grab your current dark mode setting and save it to a variable
    const currentDarkMode = localStorage.getItem("darkModeEnabled");
    // 2. Clear everything else out of localStorage
    window.localStorage.clear();
    // 3. If there was a setting saved, put it right back in
    if (currentDarkMode !== null) {
        localStorage.setItem("darkModeEnabled", currentDarkMode);
    }
    // 4. Reload the page cleanly
    window.location.reload();
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
            <p class="index" style="font-style:italic; font-weight:bolder; font-size:25px;">STAY HOME, STAY SAFE.</p>
            <p class="index" style="font-style:italic; font-weight:bolder; font-size:25px;">#Covid-19 #HomeQuarantine</p>
        `);
          return false;
    }