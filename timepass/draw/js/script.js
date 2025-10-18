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
// 💾 SAVE CANVAS FUNCTIONALITY (CORRECTED FOR ANDROID WEBVIEW/APPLINK)
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

    // --- CRITICAL FIX FOR WEBVIEW/APPLINK ---

    // 2. Convert the Data URL to a Blob object
    // This extracts the raw data and MIME type from the dataURL string.
    fetch(dataURL)
        .then(res => res.blob())
        .then(blob => {
            // 3. Create a temporary URL for the Blob
            const blobUrl = URL.createObjectURL(blob);

            // 4. Create a temporary anchor (<a>) element
            const a = document.createElement('a');
            a.href = blobUrl; // Link the anchor to the simple Blob URL
            a.download = filename;
            
            // 5. Programmatically 'click' the anchor to trigger the download
            document.body.appendChild(a); // Append is necessary for some browsers/WebViews
            a.click();
            document.body.removeChild(a); // Clean up the temporary element
            URL.revokeObjectURL(blobUrl); // Release the Blob URL memory

            // 6. Success Message
            if (typeof alertify !== 'undefined') {
                alertify.success("Drawing saved as PNG!");
            }
        })
        .catch(error => {
            // Fallback: If fetch fails (e.g., due to CORS or older browser), use the original method
            console.error("Blob creation failed, falling back to dataURL download:", error);
            
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = filename;
            a.click();
            a.remove();
        });
    
    // Optional: Use the alertify library for a success message
    alertify.success("Drawing saved as PNG!");
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