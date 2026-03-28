// JavaScript Document
const picker = document.getElementById('picker');
const alpha = document.getElementById('alpha');
const colorDisplay = document.getElementById('colorDisplay');
const hexOut = document.getElementById('hexOut');
const rgbaOut = document.getElementById('rgbaOut');
const alphaLabel = document.getElementById('alphaLabel');

/**
 * CORE UPDATE FUNCTION
 * Updates the UI and text fields based on the visual picker/slider
 */
function updateFromPicker() {
    const hex = picker.value;
    const a = alpha.value / 100;
    
    // Hex to RGB calculation
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;
    
    // 1. Update HEX field ONLY if the user isn't typing in it
    if (document.activeElement !== hexOut) {
        hexOut.value = hex.toUpperCase();
    }

    // 2. Update RGBA field ONLY if the user isn't typing in it
    if (document.activeElement !== rgbaOut) {
        rgbaOut.value = rgba;
    }
    
    // 3. Update Visuals
    colorDisplay.style.backgroundColor = rgba;
    alphaLabel.textContent = alpha.value + "%";
}

/**
 * MANUAL HEX INPUT
 */
hexOut.addEventListener('input', () => {
    let val = hexOut.value;
    const hexRegex = /^#?([A-Fa-f0-9]{3}){1,2}$/;
    
    if (hexRegex.test(val)) {
        if (!val.startsWith('#')) val = '#' + val;
        picker.value = val; // Sync the picker
        updateFromPicker(); // Sync everything else
    }
});

/**
 * MANUAL RGBA INPUT
 */
rgbaOut.addEventListener('input', () => {
    const val = rgbaOut.value;
    // Regex to extract R, G, B, and A values
    const match = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    
    if (match) {
        const r = Math.min(parseInt(match[1]), 255);
        const g = Math.min(parseInt(match[2]), 255);
        const b = Math.min(parseInt(match[3]), 255);
        const a = match[4] ? Math.min(parseFloat(match[4]), 1) : 1;

        // Convert RGB back to HEX for the picker
        const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        
        picker.value = hex;
        alpha.value = a * 100;
        
        // Update the UI
        colorDisplay.style.backgroundColor = val;
        alphaLabel.textContent = Math.round(a * 100) + "%";
        
        // Sync the HEX box since we are currently in the RGBA box
        if (document.activeElement !== hexOut) {
            hexOut.value = hex.toUpperCase();
        }
    }
});

/**
 * COPY FUNCTION
 */
function copy(id) {
    const input = document.getElementById(id);
    
    // Select the text for visual feedback
    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices
    
    // Copy to clipboard
    navigator.clipboard.writeText(input.value).then(() => {
        // --- Added Alertify Notification ---
        if (typeof alertify !== 'undefined') {
            alertify.success("Copied!");
        }

        // Button visual feedback (Checkmark)
        const btn = input.nextElementSibling;
        const originalText = btn.innerText;
        btn.innerText = "✓";
        
        setTimeout(() => {
            btn.innerText = originalText;
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Event Listeners
picker.addEventListener('input', updateFromPicker);
alpha.addEventListener('input', updateFromPicker);

// Initialize
updateFromPicker();

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