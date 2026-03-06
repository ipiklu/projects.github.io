// JavaScript Document

        const body = document.body;
        const cord = document.getElementById('cord');
        const loginForm = document.getElementById('loginForm');

        // Toggle Light Function
        cord.addEventListener('click', () => {
            body.classList.toggle('light-on');
        });

        // Form handling
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Welcome back, dreamer!');
        });
		
function reloadClear() {
    window.localStorage.clear();
    window.location.reload(true);
    return false;
}

// ESC button back feature
window.addEventListener('keydown', function(event) {
    // Check if the key pressed is 'Escape'
    if (event.key === 'Escape' || event.keyCode === 27) {
        // Option 1: Go back to the previous page in history
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // Option 2: Fallback (e.g., go to a specific URL if there's no history)
            window.location.href = 'index.html'; 
        }
    }
});			
		
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