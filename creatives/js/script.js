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

// Cache refresh
async function clearAllCaches() {
  const userConfirmed = confirm("Clear caches and force reload?");
  if (!userConfirmed) return;

  // 1. Clear Service Worker Caches (Fails silently on file://)
  try {
    if (window.caches) {
      const names = await caches.keys();
      await Promise.all(names.map(name => caches.delete(name)));
    }
  } catch (e) { console.warn("Cache API blocked on local file."); }

  // 2. Unregister Service Workers (Fails silently on file://)
  try {
    if (window.navigator && navigator.serviceWorker) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (let reg of regs) { await reg.unregister(); }
    }
  } catch (e) { console.warn("Service Worker API blocked on local file."); }

  // 3. Clear Session Storage (Usually allowed, but we wrap it anyway)
  try { sessionStorage.clear(); } catch (e) {}

  // 4. THE FIX FOR file:// — Manual URL Reconstruction
  // We use string manipulation because the URL object can be finicky locally
  let currentHref = window.location.href;
  
  // Remove any existing timestamp to prevent ?t=123?t=456
  let cleanUrl = currentHref.split('?')[0].split('#')[0]; 
  
  // Create the new "Cache Busting" URL
  const newUrl = cleanUrl + "?t=" + Date.now();
  
  alert("Refreshing local file with timestamp: " + newUrl);
  
  // 5. Force the jump
  window.location.href = newUrl;
}
	