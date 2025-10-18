// JavaScript Document

const canvas = document.getElementById('canvas');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const sizeEL = document.getElementById('size');
const colorEl = document.getElementById('color');
const clearEl = document.getElementById('clear');
const saveBtn = document.getElementById('save');

const ctx = canvas.getContext('2d');

let size = 10
let isPressed = false
colorEl.value = 'black'
let color = colorEl.value
let x
let y

// =================================================================
// 🖼️ MOUSE EVENT LISTENERS (Existing)
// =================================================================

canvas.addEventListener('mousedown', (e) => {
    isPressed = true

    x = e.offsetX
    y = e.offsetY
})

document.addEventListener('mouseup', (e) => {
    isPressed = false

    x = undefined
    y = undefined
})

canvas.addEventListener('mousemove', (e) => {
    if(isPressed) {
        const x2 = e.offsetX
        const y2 = e.offsetY

        drawCircle(x2, y2)
        drawLine(x, y, x2, y2)

        x = x2
        y = y2
    }
})

// =================================================================
// 🖊️ TOUCH/STYLUS EVENT LISTENERS (NEW ADDITION)
// =================================================================
// Get touch/stylus coordinates relative to the canvas,
// with correction for CSS scaling (DPI correction).
function getTouchPos(canvasDom, touchEvent) {
    const rect = canvasDom.getBoundingClientRect();
    const touch = touchEvent.touches[0] || touchEvent.changedTouches[0]; 

    // CRITICAL CORRECTION: Calculate the ratio between the actual drawing
    // surface size (canvas.width/height) and the displayed size (rect.width/height)
    const scaleX = canvasDom.width / rect.width;
    const scaleY = canvasDom.height / rect.height;

    return {
        // Apply the scale factor to the translated client coordinates
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
    };
}

// 1. Touch Start (like mousedown) - Logic remains correct
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    isPressed = true;
    
    // Uses the corrected getTouchPos
    const pos = getTouchPos(canvas, e); 
    x = pos.x;
    y = pos.y;
}, { passive: false }); 

// 2. Touch End (like mouseup) - Logic remains correct
document.addEventListener('touchend', (e) => {
    isPressed = false;
    x = undefined;
    y = undefined;
});

// 3. Touch Move (like mousemove) - Logic remains correct
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); 
    if(isPressed) {
        // Uses the corrected getTouchPos
        const pos = getTouchPos(canvas, e);
        const x2 = pos.x;
        const y2 = pos.y;

        drawCircle(x2, y2);
        drawLine(x, y, x2, y2);

        x = x2;
        y = y2;
    }
}, { passive: false });


// =================================================================
// 🎨 DRAWING FUNCTIONS (Existing)
// =================================================================

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.strokeStyle = color
    ctx.lineWidth = size * 2
    ctx.stroke()
}

// =================================================================
// ⚙️ UI LOGIC (Existing)
// =================================================================

function updateSizeOnScreen() {
    sizeEL.innerText = size
}

increaseBtn.addEventListener('click', () => {
    size += 5

    if(size > 50) {
        size = 50
    }

    updateSizeOnScreen()
})

decreaseBtn.addEventListener('click', () => {
    size -= 5

    if(size < 5) {
        size = 5
    }

    updateSizeOnScreen()
})

colorEl.addEventListener('change', (e) => color = e.target.value)

clearEl.addEventListener('click', () => ctx.clearRect(0,0, canvas.width, canvas.height))


// =================================================================
// 💾 SAVE CANVAS FUNCTIONALITY (MODIFIED FOR APPLIX/WEBVIEW FALLBACK)
// =================================================================

saveBtn.addEventListener('click', () => {
    // 1. Get the canvas data as a Data URL
    const dataURL = canvas.toDataURL("image/png");

    // --- FILENAME GENERATION (REMAINS THE SAME) ---
    const now = new Date();
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", 
                        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const pad = (num) => num.toString().padStart(2, '0');
    const day = pad(now.getDate());
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    const filename = `drawing_${day}${month}${year}_${hours}${minutes}${seconds}.png`;
    // ----------------------------------------------

    // --- CRITICAL ATTEMPT #1: NATIVE BRIDGE (BEST SOLUTION) ---
    // If Appilix provides a global object for native calls, use it immediately.
    if (window.AppilixBridge && window.AppilixBridge.saveBase64File) {
        // Pass the data URL and filename to the native layer for saving
        window.AppilixBridge.saveBase64File(dataURL, filename, 'image/png');
        console.log("Saving via Appilix Native Bridge.");
        
        if (typeof alertify !== 'undefined') {
            alertify.success("Drawing saved!");
        }
        return; // Stop here if native bridge is used
    }
    // ---------------------------------------------------------

    // --- CRITICAL ATTEMPT #2: BLOB METHOD (REVERTED TO DIRECT DATA URL FOR APPILIX HACK) ---
    // Since the full fetch/blob/revoke process often fails in restricted WebViews,
    // we use a simplified direct data URL click as the most immediate fallback hack.
    
    // Create a temporary anchor (<a>) element
    const a = document.createElement('a');
    a.href = dataURL; 
    a.download = filename;

    // Append to body (required for many environments) and trigger click immediately
    document.body.appendChild(a); 
    a.click();
    
    // Clean up immediately
    document.body.removeChild(a); 
    a.remove();
	
	setTimeout(() => {
        window.location.href = dataURL;
    }, 100);
    
    // -------------------------------------------------------------------------------------

    // Optional: Success Message (Assuming the native wrapper will handle the download in the background)
    if (typeof alertify !== 'undefined') {
        alertify.success("Drawing saved! (Check Notifications/Downloads)");
    } else {
        console.log("Download command issued. Check your device's downloads.");
    }

});

<!---Reload --->
function reloadClear() {
    window.localStorage.clear();
    window.location.reload(true);
    return false;
}

<!---POPUP Coustomization---> 
	  function view() {
          alertify.alert("<a href='https://www.linkedin.com/in/sayantan-kundu-52650758' target='_blank'><img src='img/linkedin.png' style='max-width: 90%; max-height: 70%'/></a><br/><a href='https://twitter.com/piklu21' target='_blank'><img src='img/twitter.png' style='max-width: 30%; max-height: 30%'/></a><a href='https://www.facebook.com/kundupiklu' target='_blank'><img src='img/facebook.jpg' style='max-width: 30%; max-height: 30%'/> </a><a href='https://www.instagram.com/i_piklu/' target='_blank'><img src='img/instagram.png' style='max-width: 30%; max-height: 30%'/></a><p class='index' style='font-style:italic; font-weight:bolder; font-size:25px' />STAY HOME, STAY SAFE.</p><p class='index' style='font-style:italic; font-weight:bolder; font-size:25px' />#Covid-19 #HomeQuarantine</p>");
          return false;
    }