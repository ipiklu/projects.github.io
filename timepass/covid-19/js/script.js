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