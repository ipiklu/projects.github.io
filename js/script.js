// JavaScript Document

<!---POPUP Coustomization---> 
	  function view() {
          alertify.alert("<a href='https://www.linkedin.com/in/sayantan-kundu-52650758' target='_blank'><img src='img/linkedin.png' style='max-width: 90%; max-height: 70%'/></a><br/><a href='https://twitter.com/piklu21' target='_blank'><img src='img/twitter.png' style='max-width: 30%; max-height: 30%'/></a><a href='https://www.facebook.com/kundupiklu' target='_blank'><img src='img/facebook.jpg' style='max-width: 30%; max-height: 30%'/> </a><a href='https://www.instagram.com/i_piklu/' target='_blank'><img src='img/instagram.png' style='max-width: 30%; max-height: 30%'/></a><p style='color:#AA205C; font-style:italic; font-weight:bolder; font-size:25px' />STAY HOME, STAY SAFE.</p><p style='color:#AA205C; font-style:italic; font-weight:bolder; font-size:25px' />#Covid-19 #HomeQuarantine</p>");
          return false;
    }
	
function reloadClear() {
    window.localStorage.clear();
    window.location.reload(true);
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
            }, 1700); // The 1700ms (1.7 second) delay
        };	