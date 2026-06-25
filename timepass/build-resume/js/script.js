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

// Taking elements from HTML 
const inputField = document.querySelector(".inputField"); 
const main = document.querySelector(".resume-builder"); 
const outputContainer = document.querySelector(".output_container"); 

let isHidden = true; 

// Function to toggle between input form and resume preview 
function hide() { 
	if (isHidden) { 
	
		// Hide the input form and show the resume preview 
		main.style.display = "none"; 
		isHidden = false; 
		outputContainer.style.display = "block"; 
		outputContainer.innerHTML = ` 
			<div class="output"> 
				<div class="heading"> 
					<h1>${inputField["name"].value}</h1> 
					<h4>${inputField["title"].value}</h4> 
				</div>
				<div class="info"> 
					<div class="left"> 
						<div class="box"> 
							<h2>Objective</h2> 
							<p>${inputField["objective"].value}</p> 
						</div> 
						<div class="box"> 
							<h2>Skills</h2> 
							<p>${inputField["skills"].value}</p> 
						</div> 
						<div class="box"> 
							<h2>Academic Details</h2> 
							<p>${inputField["academic_details"].value}</p> 
						</div> 
						<div class="box"> 
							<h2>Contact</h2> 
							<p>${inputField["contact"].value}</p> 
						</div> 
					</div> 
					<div class="right"> 
						<div class="box"> 
							<h2>Work Experience</h2> 
							<p>${inputField["work_experience"].value}</p> 
						</div> 
						<div class="box"> 
							<h2>Achievements</h2> 
							<p>${inputField["achievements"].value}</p> 
						</div> 
						<div class="box"> 
							<h2>Projects</h2> 
							<p>${inputField["projects"].value}</p> 
						</div> 
					</div> 
				</div> 
			</div> 
			<button id="printPageButton" onclick="print()" class="btn signup btnEffect">Print Resume</button> 
		`; 
	} else { 
		// Show the input form and hide the resume preview 
		main.style.display = "block"; 
		isHidden = true; 

		outputContainer.style.display = "none"; 
		outputContainer.innerHTML = ""; 
	} 
}

<!---POPUP Coustomization---> 
	  function view() {
          alertify.alert("<a href='https://www.linkedin.com/in/sayantan-kundu-52650758' target='_blank'><img src='img/linkedin.png' style='max-width: 90%; max-height: 70%'/></a><br/><a href='https://twitter.com/piklu21' target='_blank'><img src='img/twitter.png' style='max-width: 30%; max-height: 30%'/></a><a href='https://www.facebook.com/kundupiklu' target='_blank'><img src='img/facebook.jpg' style='max-width: 30%; max-height: 30%'/> </a><a href='https://www.instagram.com/i_piklu/' target='_blank'><img src='img/instagram.png' style='max-width: 30%; max-height: 30%'/></a><p class='index' style='font-style:italic; font-weight:bolder; font-size:25px' />STAY HOME, STAY SAFE.</p><p class='index' style='font-style:italic; font-weight:bolder; font-size:25px' />#Covid-19 #HomeQuarantine</p>");
          return false;
    }