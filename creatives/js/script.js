// JavaScript Document

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

<!---POPUP Coustomization---> 
	  function view() {
          alertify.alert("<a href='https://www.linkedin.com/in/sayantan-kundu-52650758' target='_blank'><img src='img/linkedin.png' style='max-width: 90%; max-height: 70%'/></a><br/><a href='https://twitter.com/piklu21' target='_blank'><img src='img/twitter.png' style='max-width: 30%; max-height: 30%'/></a><a href='https://www.facebook.com/kundupiklu' target='_blank'><img src='img/facebook.jpg' style='max-width: 30%; max-height: 30%'/> </a><a href='https://www.instagram.com/i_piklu/' target='_blank'><img src='img/instagram.png' style='max-width: 30%; max-height: 30%'/></a><p class='index' style='font-style:italic; font-weight:bolder; font-size:25px' />STAY HOME, STAY SAFE.</p><p class='index' style='font-style:italic; font-weight:bolder; font-size:25px' />#Covid-19 #HomeQuarantine</p>");
          return false;
    }

function reloadClear() {
    window.localStorage.clear();
    window.location.reload(true);
    return false;
}

// Cache refresh (Local & Server - Neuclear Option)
	// 1. THE LOCKDOWN (Runs immediately)
	(function lockAndCleanURL() {
	  const params = new URLSearchParams(window.location.search);
	  const currentId = params.get('t');
	  const savedId = sessionStorage.getItem('valid_t_id');
	
	  // If we have a saved ID, we MUST match it exactly
	  if (savedId) {
		const expectedQuery = "?t=" + savedId;
		const currentHref = window.location.href;
	
		// Check: Does the URL end with exactly "?t=12345"?
		if (!currentHref.endsWith(expectedQuery)) {
		  
		  // FIX THE LOOP: Use replaceState to overwrite the "bad" URL 
		  // so the browser 'forgets' the user typed anything extra.
		  const cleanPath = window.location.pathname + expectedQuery;
		  window.location.replace(cleanPath); 
		}
	  }
	})();
	
	// 2. YOUR REFRESH FUNCTION
	async function clearAllCaches() {
	  const userConfirmed = confirm("Clear caches and force reload?");
	  if (!userConfirmed) return;
	
	  // ... (Your Cache/Service Worker clearing code) ...
	
	  const newId = Date.now().toString();
	  
	  // Save to session memory so the Watchdog knows this is the ONLY allowed ID
	  sessionStorage.setItem('valid_t_id', newId);
	
	  const fileName = window.location.pathname.split('/').pop();
	  const finalUrl = fileName + "?t=" + newId;
	  
	
	  // Use replace to ensure the "pre-cache" URL isn't in the history
	  window.location.replace(finalUrl);
	}