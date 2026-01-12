// 1. Initialize PDF.js Worker
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdf.worker.min.js';

const resultContent = document.getElementById('result-content');

// 2. Setup Persistent Camera Scanner
const scanner = new Html5QrcodeScanner("reader", { 
    fps: 15, 
    qrbox: { width: 250, height: 180 },
    rememberLastUsedCamera: true,
    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA], // Forces camera only for the UI instance
    formatsToSupport: [ 
        Html5QrcodeSupportedFormats.QR_CODE, 
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.ITF
    ]
});

// Safe Render Function to prevent "removeChild" errors on mobile
async function startScanner() {
    try {
        const readerElement = document.getElementById('reader');
        if (readerElement) readerElement.innerHTML = ""; // Clear any lingering nodes
        
        scanner.render((text) => handleDecodedText(text, true), (err) => {
            // Frame-by-frame errors are ignored for performance
        });
    } catch (err) {
        console.error("Scanner initialization failed:", err);
    }
}

// Start the scanner after a short delay for mobile DOM stability
setTimeout(startScanner, 500);

// 3. File Upload Listener
document.getElementById('qr-input-file').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    resultContent.innerHTML = "\u{23F3} Analyzing document...";

    if (file.type === "application/pdf") {
        extractTextFromPDF(file);
    } else {
        // Handle image files (JPG/PNG)
        // We use a separate instance for file scanning to avoid UI conflicts
        const fileScanner = new Html5Qrcode("reader"); 
        try {
            const result = await fileScanner.scanFileV2(file, true);
            handleDecodedText(result.decodedText, false);
            // Clean up the file scanner after use
            fileScanner.clear();
        } catch (err) {
            resultContent.innerHTML = "\u{274C} No code found in image.";
            console.error(err);
        }
    }
});

// 4. Robust PDF Extraction Logic
async function extractTextFromPDF(file) {
    const reader = new FileReader();
    reader.onload = async function() {
        try {
            const typedarray = new Uint8Array(this.result);
            const pdf = await pdfjsLib.getDocument({data: typedarray}).promise;
            
            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(" | ");
                fullText += pageText + " ";
            }
            
            handleDecodedText(fullText, false);
        } catch (err) {
            console.error(err);
            resultContent.innerHTML = "\u{26A0} Error reading PDF structure.";
        }
    };
    reader.readAsArrayBuffer(file);
}

// 5. Unified Detection Logic
function handleDecodedText(text, isFromCamera) {
    const rawValue = text.trim();
    // CLEANING: Remove pipes and extra spaces
    const cleanText = text.replace(/[|"\r\n]/g, " ").replace(/\s+/g, " ");

    // --- CAMERA RULE (URLs) ---
    if (isFromCamera && (rawValue.includes("http") || rawValue.includes("www."))) {
        return renderLinkButton(rawValue);
    }

    // --- EXTRACTION FILTERS ---

    // 1. SBSTC Reservation Slip (W + 7 digits)
    const sbstcW = cleanText.match(/\b(W\d{7})\b/i);
    if (sbstcW) return renderPNRWithQR(sbstcW[1].toUpperCase(), "Reservation Slip");

    // 2. redBus Ticket (TUDD + 8 digits)
    const redBusT = cleanText.match(/\b(TUDD\d{8})\b/i);
    if (redBusT) return renderPNRWithQR(redBusT[1].toUpperCase(), "Ticket Number");

    // 3. SBSTC Ticket (L + 10-11 digits)
    const sbstcL = cleanText.match(/\b(L\d{10,11})\b/i);
    if (sbstcL) return renderPNRWithQR(sbstcL[1].toUpperCase(), "Ticket Number");

    // 4. TRAIN PNR (10-digit block, excluding known mobile prefixes)
    const trainMatch = cleanText.match(/\b\d{10}\b/g);
    if (trainMatch) {
        for (let num of trainMatch) {
            if (!num.startsWith("890") && !num.startsWith("994") && !num.startsWith("8900")) {
                return renderPNRWithQR(num, "Train PNR");
            }
        }
    }

    // 5. KEYWORD FILTER
    const keywords = /(?:PNR|Booking No|Booking Ref|Ticket Number)[.\/:\s]*/i;
    if (keywords.test(cleanText)) {
        const parts = cleanText.split(keywords);
        for (let i = 1; i < parts.length; i++) {
            let context = parts[i].trim().substring(0, 15);
            const codeMatch = context.match(/([A-Z0-9]{6,12})/i);
            if (codeMatch) {
                const code = codeMatch[1].toUpperCase();
                if (!code.startsWith("202") && code !== "1" && code !== "2") {
                    return renderPNRWithQR(code, "Booking Reference");
                }
            }
        }
    }

    resultContent.innerHTML = "\u{274C} No valid booking reference detected.";
}

// 6. UI RENDER FUNCTIONS
function renderPNRWithQR(value, label) {
    resultContent.innerHTML = `
        <div class="pnr-card">
            <p style="margin:0; font-size:12px; color:#5f6368; font-weight:bold;">${label}</p>
            <h2 style="color:#AA205C; margin:10px 0; letter-spacing:1px;">${value}</h2>
            <div id="pnr-qr-code" style="display:flex; justify-content:center; margin-bottom:10px;"></div>
            <p style="margin:0; font-size:11px; color:#9aa0a6;">Scan this at the terminal</p>
        </div>
    `;

    setTimeout(() => {
        const container = document.getElementById("pnr-qr-code");
        if (container) {
            container.innerHTML = "";
            new QRCode(container, { text: value, width: 160, height: 160 });
        }
    }, 150);
}

function renderLinkButton(url) {
    // Ensure URL is clickable
    const validUrl = url.startsWith('http') ? url : `https://${url}`;
    resultContent.innerHTML = `
        <div class="link-card">
            <p style="margin-bottom: 15px; font-weight: bold; color: #AA205C;">\u{1F517} Digital Link Found</p>
            <p style="margin: 5px; font-weight: normal; color: #717171;">(${url})
                <a href="${validUrl}" target="_blank" title="${url}" class="upload-btn">\u{1F446}\u{1F5B2}</a>
            </p>
        </div>
    `;
}


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