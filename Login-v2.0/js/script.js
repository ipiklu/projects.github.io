/*
===================================================
JAVASCRIPT LOGIC (FINAL CORRECTED VERSION)
===================================================
*/
document.addEventListener('DOMContentLoaded', () => {

    const passwordInput = document.querySelector('input[type="password"]');
    if (!passwordInput) {
        console.error("CRITICAL: Password input element not found.");
        return;
    }

    const characters = document.querySelectorAll('.character');
    const pupils = document.querySelectorAll('.pupil');
    
    let isPasswordFocused = false; 
    
    // 1. Store the last known mouse position globally
    let lastMouseX = 0; 
    let lastMouseY = 0;


    // 2. Define the core pupil movement function
    const updatePupilPosition = (mouseX, mouseY, isFocused) => {
        pupils.forEach(pupil => {
            const eye = pupil.parentElement;
            const eyeRect = eye.getBoundingClientRect();
            const eyeX = eyeRect.left + (eyeRect.width / 2);
            const eyeY = eyeRect.top + (eyeRect.height / 2);

            // Calculate the angle
            const angle = Math.atan2(mouseY - eyeY, mouseX - eyeX);
            const maxRadius = 5; 

            // Calculate standard (mouse-following) offsets
            let offsetX = Math.cos(angle) * maxRadius;
            let offsetY = Math.sin(angle) * maxRadius;

            // INVERSION LOGIC (Look away if focused)
            if (isFocused) {
                offsetX = -offsetX;
                offsetY = -offsetY;
            }

            // Apply the transformation
            pupil.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
        });
    };


    // --- 3. Focus & Hover State Handlers ---
    
    const handleFocus = () => {
        isPasswordFocused = true;
        characters.forEach(char => char.classList.remove('hovered')); 
        characters.forEach(char => char.classList.add('scary'));
        // Eyes look away based on last mouse position (though they typically follow the mouse, 
        // calling here ensures they flip instantly if the mouse is stationary)
        updatePupilPosition(lastMouseX, lastMouseY, true); 
    };
    
    const handleBlur = () => {
        isPasswordFocused = false; 
        characters.forEach(char => char.classList.remove('scary'));
        
        // CRITICAL FIX: Manually trigger the eye update on blur.
        // This makes the pupils snap directly to the current mouse position.
        updatePupilPosition(lastMouseX, lastMouseY, false); 
    };

    passwordInput.addEventListener('focus', handleFocus);
    passwordInput.addEventListener('blur', handleBlur); 
    passwordInput.addEventListener('input', handleFocus); 

    // Hover logic remains the same...
    passwordInput.addEventListener('mouseenter', () => {
        if (!isPasswordFocused) {
            characters.forEach(char => char.classList.add('hovered'));
        }
    });
    passwordInput.addEventListener('mouseleave', () => {
        characters.forEach(char => char.classList.remove('hovered'));
    });

    // --- 4. Continuous Eye-Following Animation Logic ---
    document.addEventListener('mousemove', (e) => {
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        
        // Continuously update eyes based on current mouse position and focus state
        updatePupilPosition(e.clientX, e.clientY, isPasswordFocused); 
    });

    // Toggle button logic
    const toggleButton = document.getElementById('toggle-password');
    const eyeIcon = document.getElementById('eyeIcon');
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            if (eyeIcon) {
                // Assumes Font Awesome or similar icon setup
                if (type === 'password') {
                    eyeIcon.classList.remove('fa-eye');
                    eyeIcon.classList.add('fa-eye-slash');
                } else {
                    eyeIcon.classList.remove('fa-eye-slash');
                    eyeIcon.classList.add('fa-eye');
                }
            }
            passwordInput.focus();
        });
    }

});

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