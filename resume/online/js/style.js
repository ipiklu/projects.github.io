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

<!---Reload --->
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

	  function view() {
          alertify.alert("<a href='https://www.linkedin.com/in/sayantan-kundu-52650758' target='_blank'><img src='img/linkedin.png' style='max-width: 90%; max-height: 70%'/></a><br/><a href='https://twitter.com/piklu21' target='_blank'><img src='img/twitter.png' style='max-width: 30%; max-height: 30%'/></a><a href='https://www.facebook.com/kundupiklu' target='_blank'><img src='img/facebook.jpg' style='max-width: 30%; max-height: 30%'/> </a><a href='https://www.instagram.com/i_piklu/' target='_blank'><img src='img/instagram.png' style='max-width: 30%; max-height: 30%'/></a><p class='index' style='font-style:italic; font-weight:bolder; font-size:25px' />STAY HOME, STAY SAFE.</p><p class='index' style='font-style:italic; font-weight:bolder; font-size:25px' />#Covid-19 #HomeQuarantine</p>");
          return false;
    }
	
	
