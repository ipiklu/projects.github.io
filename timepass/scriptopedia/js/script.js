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

let typingTimers = [];

window.onload = function() {
    const input = document.getElementById("searchInput");
	
	// Focus when mouse enters
    input.addEventListener("mouseenter", function() {
        input.focus();
    });

    /* Remove focus when mouse leaves (feature disabled)
    input.addEventListener("mouseleave", function() {
        input.blur(); // This removes the cursor and focus state
    });*/
	
	// Enter key press for search
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSearch();
        }
    });
};

function showLoading(show) {
    const container = document.getElementById('resultsContainer');
    const sendButton = document.getElementById('searchButton');
    const chatInput = document.getElementById('searchInput');
	
    if (show) {
        const typingIndicator = document.createElement('div');
        typingIndicator.id = 'typingIndicator';
        // Your specific HTML structure for the dots
        typingIndicator.innerHTML = `
            <div class="loading-bubble">
                <span class="loading-dot animated-sparkle"></span>
                <span class="loading-dot animated-sparkle"></span>
                <span class="loading-dot animated-sparkle"></span>
            </div>
        `;
        container.appendChild(typingIndicator);
        sendButton.disabled = true;
        chatInput.disabled = true;
    } else {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
        sendButton.disabled = false;
        chatInput.disabled = false;
        chatInput.focus();
    }
}

function handleSearch() {
    typingTimers.forEach(t => clearTimeout(t));
    const queryInput = document.getElementById('searchInput');
    const query = queryInput.value.toLowerCase().trim();
    const container = document.getElementById('resultsContainer');
    
    if (!query) return;
    container.innerHTML = '';

    showLoading(true);

    setTimeout(() => {
        showLoading(false);

        // 1. Try to find exact or substring matches first
        const results = JSON_DATA.filter(item => item.title.toLowerCase().includes(query))
                        .concat(JSON_TABLE.filter(item => item.title.toLowerCase().includes(query)));

        if (results.length === 0) {
            container.innerHTML = ''; 

            // 2. Look for "Did you mean?" partial keyword matches
            const queryWords = query.split(/\s+/).filter(word => word.length > 2); 
            let suggestions = [];

            if (queryWords.length > 0) {
                const allItems = JSON_DATA.concat(JSON_TABLE);
                
                allItems.forEach(item => {
                    const titleLower = item.title.toLowerCase();
                    const matches = queryWords.filter(word => titleLower.includes(word));
                    
                    if (matches.length > 0) {
                        suggestions.push({
                            title: item.title,
                            matchCount: matches.length
                        });
                    }
                });

                suggestions.sort((a, b) => b.matchCount - a.matchCount);
            }

            // 3. IF SUGGESTIONS EXIST: Run animation sequence
            if (suggestions.length > 0) {
                const suggestionBox = document.createElement('div');
                suggestionBox.className = "suggestion-container-box";
                
                // Create element for the main heading
                const headingEl = document.createElement('div');
                headingEl.className = "typing suggestion-heading";
                suggestionBox.appendChild(headingEl);
                suggestionBox.appendChild(document.createElement('br'));

                // Create a container for the animated image
                const animationContainer = document.createElement('div');
                animationContainer.className = "thinking-animation-container";
                
                const animImg = document.createElement('img');
                animImg.src = "img/GalaxyAI.gif"; // Path to your animated gif/apng
                animImg.className = "thinking-loader-image";
                
                animationContainer.appendChild(animImg);
                suggestionBox.appendChild(animationContainer);

                // Setup suggestion elements, but do NOT append them yet
                const uniqueTopSuggestions = [...new Set(suggestions.map(s => s.title))];
                const suggestionElements = [];

                uniqueTopSuggestions.forEach((title) => {
                    const linkWrap = document.createElement('div');
                    linkWrap.className = "suggestion-link-wrapper";
                    
                    const linkEl = document.createElement('a');
                    linkEl.href = "#";
                    linkEl.className = "typing suggestion-link";
                    
                    const escapedTitle = title.replace(/'/g, "\\'");
                    linkEl.setAttribute("onclick", `document.getElementById('searchInput').value='${escapedTitle}'; handleSearch(); return false;`);
					linkEl.setAttribute("title", "Click-To-Search");
                    
                    linkWrap.appendChild(linkEl);
                    suggestionElements.push({ wrapper: linkWrap, element: linkEl, text: title });
                });

                container.appendChild(suggestionBox);

                // A. Type the heading first
                const headingText = `Did you mean? <label style="color: #AA7503;">(Choose \u{1F447}/ Type <span href="#" title="Click-To-Search" class="suggestion-help-inline-link index-alert" onclick="document.getElementById('searchInput').value='help'; handleSearch(); return false;">help</span>)</label>`;
                typeEffect(headingEl, headingText);

                // B. Wait 5 seconds, remove the image, then type the links
                setTimeout(() => {
                    // Remove the animated image container
                    if (animationContainer.parentNode) {
                        animationContainer.parentNode.removeChild(animationContainer);
                    }

                    // Append and trigger typing for each suggestion link
                    suggestionElements.forEach(item => {
                        suggestionBox.appendChild(item.wrapper);
                        typeEffect(item.element, item.text);
                    });
                }, 2000); // 5000 milliseconds = 5 seconds

                return; 
            }

            // 4. FALLBACK: Run if zero exact AND zero partial matches are found
            const noMatchMsg = document.createElement('div');
            const helpMsg = document.createElement('div');
            const imageContainer = document.createElement('div');
            
            noMatchMsg.className = "typing NoMatch";
            helpMsg.className = "typing animated-tick";

            container.appendChild(noMatchMsg);
            container.appendChild(document.createElement('br'));
            container.appendChild(helpMsg);
            container.appendChild(document.createElement('br'));
            container.appendChild(document.createElement('br'));

            const imgEl = document.createElement('img');
            imgEl.src = "img/waiting_room_landscape.avif";
            imgEl.className = "fallback-error-image";
            imageContainer.appendChild(imgEl);
            container.appendChild(imageContainer);
            
            const message = `No matches found for "${query}"`;
            const help_message = `Type <b><i class="index-alert">help</i></b> for searching keywords`;
            typeEffect(noMatchMsg, message);
            typeEffect(helpMsg, help_message);
            
            return;
        }

        // Render matching results if exact ones exist
        results.forEach(res => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.style.textAlign = 'center'; 

            if (res.content.toLowerCase().includes('<table')) {
                div.innerHTML = `<div>${res.content}</div>`;
                container.appendChild(div);
            } else {
                div.innerHTML = `<p class="typing animated-sparkle index-alert"></p>`;
                container.appendChild(div);
                typeEffect(div.querySelector('p'), res.content);
            }
        });
    }, 2000); 
}

function typeEffect(el, text) {
    let i = 0;
    function type() {
        if (i < text.length) {
            if (text[i] === '<') {
                let end = text.indexOf('>', i);
                el.innerHTML += text.substring(i, end + 1);
                i = end + 1;
            } else {
                el.innerHTML += text[i];
                i++;
            }
			
			// Use .substring(0, i) and replace the whole content
            // This prevents the browser from getting confused by partial tags
			el.innerHTML = text.substring(0, i);
			
            typingTimers.push(setTimeout(type, 30));
        } else {
            el.classList.remove('typing');
        }
    }
    type();
}

// New function to navigate back
	const goBack = () => {
    	window.location.href = "../server/index.html";
		return "Bye have a good day!!";	
	};

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

<!---Menu button extender--->
console.log("script.js loaded")

const menuBtn = document.getElementById("menuBtn");
const menuItems = document.querySelectorAll(".menu-item");

menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    
    // Toggle the class
    const isOpen = menuBtn.classList.toggle("open");
    
    // Update the title attribute based on the state
    menuBtn.title = isOpen ? "Close Menu" : "Open Menu";
    
    // Toggle items
    menuItems.forEach(item => {
        item.classList.toggle("show");
    });
});

// Update the "click outside" logic to also reset the title
document.addEventListener("click", (e) => {
    if (!menuBtn.contains(e.target)) {
        menuBtn.classList.remove("open");
        menuBtn.title = "Open Menu"; // Reset title
        menuItems.forEach(item => item.classList.remove("show"));
    }
});

//Prevent clicks on menu items for bubbling */ 
menuItems.forEach(item => {
	item.addEventListener("click", e => e.stopPropagation());
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

<!---MicroSoft Excel function (Open locally)--->
function openExcel() {
	const fileUrl = "https://ipiklu.github.io/projects.github.io/timepass/scriptopedia/data/blank/blank.xlsx";
	//Encode only the file URL part
	window.location.href = "ms-excel:ofe|u|" + encodeURI(fileUrl);
}

<!---MicroSoft Word function (Open locally)--->
function openWord() {
	const fileUrl = "https://ipiklu.github.io/projects.github.io/timepass/scriptopedia/data/blank/blank.docx";
	//Encode only the file URL part
	window.location.href = "ms-word:ofe|u|" + encodeURI(fileUrl);
}

<!---MicroSoft PowerPoint function (Open locally)--->
function openPowerPoint() {
	const fileUrl = "https://ipiklu.github.io/projects.github.io/timepass/scriptopedia/data/blank/blank.pptx";
	//Encode only the file URL part
	window.location.href = "ms-powerpoint:ofe|u|" + encodeURI(fileUrl);
}

<!---POPUP URL Coustomization--(HTTPS)-> 
function popUrl() {
    let url = prompt('URL (e.g: example.com):');
    
    if (!url || url.trim() === "") return;

    let input;
    let paramCount = 0;

    while (true) {
        input = prompt(`How many extra parameters (Integer number only)?\nLeave it blank and either press ok or cancel (InCase of no parameter)\n\n(e.g: ${url}/parameter1)`);
        
        if (input === null || input.trim() === "") {
            paramCount = 0; 
            break; 
        }

        if (/^\d+$/.test(input.trim())) {
            paramCount = parseInt(input);
            break; 
        }
        alert("Error: Please enter a whole number (no decimals or letters).");
    }

    let allParams = "";
    let currentPath = url.trim();

    for (let i = 0; i < paramCount; i++) {
        // Calculate the label for the current step (e.g., parameter1, parameter2)
        let paramLabel = `parameter${i + 1}`;
        
        // Show the specific parameter number in the example prompt
        let p = prompt(`Enter ${paramLabel}:\n\n(e.g: ${currentPath}/${paramLabel})`);
        
        if (p !== null && p.trim() !== "") {
            let encodedP = encodeURIComponent(p.trim());
            allParams += '/' + encodedP;
            // Update the preview path for the next iteration
            currentPath += '/' + encodedP;
        } else {
            // If the user cancels or leaves blank, stop the loop and open what we have
            break; 
        }
    }

    let finalUrl = 'https://' + url.trim() + allParams;
    window.open(finalUrl, 'bfs', 'fullscreen,scrollbars');
}

<!---POPUP URL Coustomization---(HTTP)> 
function popUrl_http() {
    let url = prompt('URL (e.g: example.com):');
    
    if (!url || url.trim() === "") return;

    let input;
    let paramCount = 0;

    while (true) {
        input = prompt(`How many extra parameters (Integer number only)?\nLeave it blank and either press ok or cancel (InCase of no parameter)\n\n(e.g: ${url}/parameter1)`);
        
        if (input === null || input.trim() === "") {
            paramCount = 0; 
            break; 
        }

        if (/^\d+$/.test(input.trim())) {
            paramCount = parseInt(input);
            break; 
        }
        alert("Error: Please enter a whole number (no decimals or letters).");
    }

    let allParams = "";
    let currentPath = url.trim();

    for (let i = 0; i < paramCount; i++) {
        // Calculate the label for the current step (e.g., parameter1, parameter2)
        let paramLabel = `parameter${i + 1}`;
        
        // Show the specific parameter number in the example prompt
        let p = prompt(`Enter ${paramLabel}:\n\n(e.g: ${currentPath}/${paramLabel})`);
        
        if (p !== null && p.trim() !== "") {
            let encodedP = encodeURIComponent(p.trim());
            allParams += '/' + encodedP;
            // Update the preview path for the next iteration
            currentPath += '/' + encodedP;
        } else {
            // If the user cancels or leaves blank, stop the loop and open what we have
            break; 
        }
    }

    let finalUrl = 'http://' + url.trim() + allParams;
    window.open(finalUrl, 'bfs', 'fullscreen,scrollbars');
}

<!---URL Hide logic---> 
function BotHiddenUrl() {
	// 1. Open a blank window first
    // This window will inherit the origin of your current site
	const newWin = window.open('about:blank', '_blank', 'fullscreen,scrollbars');

    if (!newWin) {
        alert("Please allow popups for this site!");
        return;
    }
	  // 2. Define the HTML content
	  const htmlContent = `<html>
	  		<title>Bot-Terminal</title>
			<body style="background: #000;">
				<iframe src="http://161.118.185.109:8020" id="botFrame" referrerpolicy="no-referrer" width="100%" height="100%" style="border: none; outline: none;"></iframe>
			</body>
			</html>`;
	  
	// 3. Write the content into the new window
		// This "activates" the window while keeping the valid origin
		newWin.document.open();
		newWin.document.write(htmlContent);
		newWin.document.close();
}

<!---Celebrations---> 
let isAnimating = false; // Guard variable

function spreadCelebration() {
    // If already running, don't start another loop
    if (isAnimating) return; 
    
    isAnimating = true;
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;

    const randomColor = () => {
        return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    };

    (function frame() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            isAnimating = false; // Reset so the button works again
            return;
        }

        confetti({
            particleCount: 2, // Low count per frame keeps it smooth
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors: [randomColor(), randomColor()],
            gravity: 0.9,
            ticks: 200, // Reduced lifetime to clear memory faster
            scalar: 1.1
        });

        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors: [randomColor(), randomColor()],
            gravity: 0.9,
            ticks: 200,
            scalar: 1.1
        });

        requestAnimationFrame(frame);
    }());
}

function openEditableTab() {

	const iconUrl = 'https://ipiklu.github.io/projects.github.io/img/s.gif'; 
	const cssUrl = 'https://ipiklu.github.io/projects.github.io/notepad/css/webnote.css';
	
	  // 1. Define the HTML content
	  const htmlContent = `<html contenteditable class="animated-sparkle" style="padding-top:10px;padding-left:10px;font-family:'Indie Flower',cursive;">
	  		<title>Web-Note</title>
			<link rel="icon" href="${iconUrl}" type="image/gif">
			<link rel="stylesheet" href="${cssUrl}" /></html>`;
	  
	  // 2. Create a Blob (Binary Large Object)
	  const blob = new Blob([htmlContent], { type: 'text/html' });
	  
	  // 3. Create a temporary URL for the Blob
	  const blobUrl = URL.createObjectURL(blob);
	  
	  // 4. Open the new window/tab using the Blob URL
	  window.open(blobUrl, '_blank','fullscreen,scrollbars');
	  
	  // Clean up the URL once the window is open (optional, but good practice)
	  // URL.revokeObjectURL(blobUrl); 
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
                    <img src="img/twitter.png" style="max-width: 150px; width: 100%; height: auto;" alt="Twitter"/>
                </a>
                <a href="https://www.facebook.com/kundupiklu" target="_blank">
                    <img src="img/facebook.jpg" style="max-width: 150px; width: 100%; height: auto;" alt="Facebook"/> 
                </a>
                <a href="https://www.instagram.com/i_piklu/" target="_blank">
                    <img src="img/instagram.png" style="max-width: 150px; width: 100%; height: auto;" alt="Instagram"/>
                </a>
            </div>
            <p class="index-alert" style="font-style:italic; font-weight:bolder; font-size:25px;">STAY HOME, STAY SAFE.</p>
            <p class="index-alert" style="font-style:italic; font-weight:bolder; font-size:25px;">#Covid-19 #HomeQuarantine</p>
        `);
          return false;
    }