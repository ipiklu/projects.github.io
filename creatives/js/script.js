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
	// ==========================================
	// 1. THE WATCHDOG (Runs immediately)
	// ==========================================
	(function singleSessionLock() {
	  const params = new URLSearchParams(window.location.search);
	  const currentId = params.get('t');
	  const savedId = sessionStorage.getItem('valid_t_id');
	
	  if (savedId) {
		const expectedQuery = "?t=" + savedId;
		const currentHref = window.location.href;
	
		// If the URL text is wrong OR the internal stamp is missing
		if (!currentHref.endsWith(expectedQuery) || !window.history.state || window.history.state.stamp !== savedId) {
		  
		  const cleanUrl = window.location.pathname + expectedQuery;
	
		  // FIX: Overwrite the current history slot so the 'junk' or 'old' version is erased
		  window.history.replaceState({ stamp: savedId }, "", cleanUrl);
		  
		  // Force reload to the clean version
		  window.location.replace(cleanUrl);
		}
	  }
	})();
	
	// ==========================================
	// 2. THE REFRESH FUNCTION
	// ==========================================
	async function clearAllCaches() {
	  const userConfirmed = confirm("Refresh session and overwrite history?");
	  if (!userConfirmed) return;
	
	  // Clear existing caches
	  try {
		if (window.caches) {
		  const names = await caches.keys();
		  await Promise.all(names.map(name => caches.delete(name)));
		}
		sessionStorage.clear();
	  } catch (e) {}
	
	  // Generate the NEW unique ID
	  const newId = Date.now().toString();
	  
	  // Save to session memory
	  sessionStorage.setItem('valid_t_id', newId);
	
	  const fileName = window.location.pathname.split('/').pop() || "index.html";
	  const finalUrl = fileName + "?t=" + newId;
	
	  // --- THE MAGIC STEP ---
	  // Instead of just redirecting, we MANUALLY replace the history state first.
	  // This tells the browser: "The current history entry is now this NEW URL."
	  window.history.replaceState({ stamp: newId }, "", finalUrl);
	
	  // Then we load the new URL content into that same slot
	  window.location.replace(finalUrl);
	}