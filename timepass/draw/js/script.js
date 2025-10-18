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

<!------ Save Canvas Functionality -------->
saveBtn.addEventListener('click', () => {
    // 1. Get the canvas data as a data URL
    const dataURL = canvas.toDataURL("image/png");

    // 2. Create a temporary anchor (<a>) element
    const a = document.createElement('a');
    a.href = dataURL;

    // --- MODIFICATION for Custom Format: drawing_18OCT2025_183500 ---
    const now = new Date();
    
    // Array of three-letter month abbreviations
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", 
                        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    // Function to ensure two digits (e.g., '08' instead of '8')
    const pad = (num) => num.toString().padStart(2, '0');

    // Date components: DD, MON, YYYY
    const day = pad(now.getDate());
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    // Time components: HH, MM, SS
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    // Construct the final filename string
    const filename = `drawing_${day}${month}${year}_${hours}${minutes}${seconds}.png`;
    // Example: drawing_18OCT2025_183533.png

    a.download = filename;
    // --- END MODIFICATION ---

    // 3. Programmatically 'click' the anchor to trigger the download
    a.click();

    // 4. Clean up the temporary element
    a.remove();
    
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