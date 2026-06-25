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

// --- PWA Service Worker Logic ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then(reg => console.log('PWA Ready! Scope is:', reg.scope))
      .catch(err => console.log('PWA Registration Failed:', err));
  });
}

let deferredPrompt;

// Catch the install capability if Chrome fires it natively
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log("Chrome engine native PWA prompt captured.");
});

// Setup UI events once the DOM layout structures are ready
document.addEventListener('DOMContentLoaded', () => {
  const installBtn = document.getElementById('pwa-install-btn');
  const closeBtn = document.getElementById('pwa-close-btn');
  const pwaBanner = document.getElementById('pwa-banner');

  // FORCE SHOW: Force the banner visible immediately for testing/bypass
  if (pwaBanner) {
    pwaBanner.style.display = 'block';
  }

  if (installBtn) {
    installBtn.addEventListener('click', () => {
      // If Chrome allowed the PWA engine event, trigger the slick native pop-up window
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User installed the PWA successfully');
          }
          if (pwaBanner) pwaBanner.style.display = 'none';
          deferredPrompt = null;
        });
      } else {
        // FALLBACK: If Chrome blocked the hook, seamlessly open your APK Dropdown instead
        if (pwaBanner) pwaBanner.style.display = 'none';
        appDownload(); 
        alertify.log("PWA browser install restricted. Opening direct APK downloads instead!", "error", 5000);
      }
    });
  }

  if (closeBtn && pwaBanner) {
    closeBtn.addEventListener('click', () => {
      pwaBanner.style.display = 'none';
    });
  }
});

<!---POPUP Coustomization---> 
	  function view() {
          alertify.alert("<a href='https://www.linkedin.com/in/sayantan-kundu-52650758' target='_blank'><img src='img/linkedin.png' style='max-width: 90%; max-height: 70%'/></a><br/><a href='https://twitter.com/piklu21' target='_blank'><img src='img/twitter.png' style='max-width: 30%; max-height: 30%'/></a><a href='https://www.facebook.com/kundupiklu' target='_blank'><img src='img/facebook.jpg' style='max-width: 30%; max-height: 30%'/> </a><a href='https://www.instagram.com/i_piklu/' target='_blank'><img src='img/instagram.png' style='max-width: 30%; max-height: 30%'/></a><p class='index' style='font-style:italic; font-weight:bolder; font-size:25px' />STAY HOME, STAY SAFE.</p><p class='index' style='font-style:italic; font-weight:bolder; font-size:25px' />#Covid-19 #HomeQuarantine</p>");
          return false;
    }

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
	
// Use window.onload to ensure the entire page is loaded
window.onload = function() {
// Set a timeout to ensure the loading animation is visible for at least 2 seconds
    setTimeout(function() {
   // Get the loading overlay and main content elements
                const loadingOverlay = document.getElementById('loading-overlay');
                const mainContent = document.getElementById('main-content');

                // Fade out the loading overlay
                loadingOverlay.classList.add('hidden');

                // After the transition, hide the overlay completely and show the main content
                loadingOverlay.addEventListener('transitionend', function() {
                    loadingOverlay.style.display = 'none';
                    mainContent.style.display = 'block';
                }, { once: true }); // The { once: true } option ensures this event listener is removed after it fires once
            }, 500); // The 500ms (0.5 second) delay
        };	