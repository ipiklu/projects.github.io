let typingTimers = [];

window.onload = function() {
    const input = document.getElementById("searchInput");
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
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const container = document.getElementById('resultsContainer');
    
    if (!query) return;
    container.innerHTML = '';

    showLoading(true);

    setTimeout(() => {
        showLoading(false);

        const results = JSON_DATA.filter(item => item.title.toLowerCase().includes(query))
                        .concat(JSON_TABLE.filter(item => item.title.toLowerCase().includes(query)));

        if (results.length === 0) {
            // Updated with backticks to correctly show the query variable
            container.innerHTML = `<p class="NoMatch">No matches found for "${query}"</p>`;
            return;
        }

        results.forEach(res => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.style.textAlign = 'left'; 

            // Simpler check: Does the content string have "<table" in it?
            if (res.content.toLowerCase().includes('<table')) {
                // Table: Display immediately without typeEffect
                div.innerHTML = `<div>${res.content}</div>`;
                container.appendChild(div);
            } else {
                // Not a table: Use your working typeEffect logic
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

<!---Reload function--->
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