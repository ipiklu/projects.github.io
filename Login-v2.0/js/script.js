    /*
    ==================================
    JAVASCRIPT LOGIC
    ==================================
    */
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('toggle-password');
    const eyeIcon = document.getElementById('eyeIcon');
    const characters = document.querySelectorAll('.character');
    const pupils = document.querySelectorAll('.pupil');

    // --- 1. Password Show/No-Show Functionality ---
    toggleButton.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        if (type === 'password') {
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        } else {
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        }
        passwordInput.focus();
    });

    // --- 2. Focus State: Scary Face (Active Input) ---
    passwordInput.addEventListener('focus', () => {
        characters.forEach(char => char.classList.remove('hovered')); 
        characters.forEach(char => char.classList.add('scary'));
    });

    passwordInput.addEventListener('blur', () => {
        characters.forEach(char => char.classList.remove('scary'));
    });

    // --- 3. Hover State: Wow/Surprised Face (Mouse Over Input) ---
    passwordInput.addEventListener('mouseenter', () => {
        if (!passwordInput.matches(':focus')) {
            characters.forEach(char => char.classList.add('hovered'));
        }
    });

    passwordInput.addEventListener('mouseleave', () => {
        characters.forEach(char => char.classList.remove('hovered'));
    });

    // --- 4. Eye-Following Animation ---
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        pupils.forEach(pupil => {
            const eye = pupil.parentElement;
            
            const eyeRect = eye.getBoundingClientRect();
            const eyeX = eyeRect.left + (eyeRect.width / 2);
            const eyeY = eyeRect.top + (eyeRect.height / 2);

            const angle = Math.atan2(mouseY - eyeY, mouseX - eyeX);
            const maxRadius = 5;

            const offsetX = Math.cos(angle) * maxRadius;
            const offsetY = Math.sin(angle) * maxRadius;

            pupil.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
        });
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