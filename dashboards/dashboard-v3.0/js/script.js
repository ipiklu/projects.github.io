lucide.createIcons();

// --- 1. Elements ---
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');
const dynamicTitle = document.getElementById('dynamic-title');
const mainGrid = document.getElementById('main-grid');
const navLinks = document.querySelectorAll('.nav-link');
const searchInput = document.getElementById('global-search');
const contentArea = document.querySelector('.content-area');

// --- 2. Unified Interaction Logic (Fixed for Desktop Click-Through) ---
let startX = 0;
let isDragging = false;
let lastScrollTop = 0;

// A. Manual Toggle
toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent the sidebar drag logic from interfering
    sidebar.classList.toggle('collapsed');
});

// B. Drag/Swipe Logic (Desktop Friendly)
sidebar.addEventListener('pointerdown', (e) => {
    // 1. Ignore if clicking interactive elements
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.nav-link')) {
        isDragging = false;
        return; 
    }

    startX = e.pageX;
    isDragging = true;
});

// We listen for movement on the window to decide when to "capture" the drag
window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const currentX = e.pageX;
    const diffX = currentX - startX;

    // 2. Only "Capture" the pointer if the user has moved more than 10px
    // This allows short clicks/taps to reach the links!
    if (Math.abs(diffX) > 10) {
        sidebar.setPointerCapture(e.pointerId);
    }
});

window.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    
    const diffX = e.pageX - startX;
    const threshold = 60; 

    if (diffX < -threshold) {
        sidebar.classList.add('collapsed');
    } else if (diffX > threshold) {
        sidebar.classList.remove('collapsed');
    }

    isDragging = false;
    // Release capture if it was ever set
    if (sidebar.hasPointerCapture(e.pointerId)) {
        sidebar.releasePointerCapture(e.pointerId);
    }
});

// C. Internal Content Scroll Logic  (To enable mouse scroll collapse the side bar)
/*contentArea.addEventListener('scroll', () => {
    let st = contentArea.scrollTop;
    if (st > lastScrollTop && st > 30) sidebar.classList.add('collapsed');
    else if (st < lastScrollTop) sidebar.classList.remove('collapsed');
    lastScrollTop = st <= 0 ? 0 : st;
}, { passive: true });*/

// --- 3. Search & Focus Logic ---
searchInput.addEventListener("mouseenter", () => searchInput.focus());
searchInput.addEventListener("mouseleave", () => searchInput.blur());

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    // Select both .card and .section-header so SME/NCC pages aren't filtered out
    const allSearchable = document.querySelectorAll('.card, .section-header');

    allSearchable.forEach(el => {
        const mainText = el.innerText.toLowerCase();
        const hiddenBank = el.querySelector('.hidden-search-bank').innerText.toLowerCase();
        
        if (mainText.includes(query) || hiddenBank.includes(query)) {
            el.style.display = 'block';
            
            // Highlight text if elements exist
            const h3 = el.querySelector('h3');
            const p = el.querySelector('p');
            if (h3) applyHighlight(h3, query);
            if (p) applyHighlight(p, query);

            // Deep highlight inside iframes
            const iframe = el.querySelector('iframe');
            if (iframe) {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    applyHighlight(iframeDoc.body, query);
                } catch (err) { /* Cross-origin security block */ }
            }
        } else {
            el.style.display = 'none';
        }
    });
});

// --- 4. Page Content Data ---
const pageContent = {
    'Overview': [
        { title: 'Primary Actions', desc: 'Main user interactions.', html: '<button class="btn btn-primary" onClick="window.open(\'https://google.com\', \'_blank\');">Submit</button>' },
        { title: 'Secondary Actions', desc: 'Less critical tasks.', html: '<button class="btn btn-outline">Cancel</button>' }
    ],
    'Provisioning': [
        { title: 'Documentation', desc: 'Local reference guide.', html: '<iframe src="topbarlinks/docs.html" width="100%" height="300px" style="border:1px solid #e2e8f0; border-radius:8px;"></iframe>' },
        { title: 'Data Exports', desc: 'Download your reports here.', html: '<button class="btn btn-outline">Download CSV</button>' }
    ],
    'IR': [
        { title: 'Management', desc: 'Danger zone actions.', html: '<button class="btn btn-danger">Delete Project</button>' }
    ],
    'Config': [
        { title: 'Account Settings', desc: 'Update your global profile.', html: '<button class="btn btn-primary">Save Settings</button>' }
    ],
    'SME': [
        { isHeader: true, html: '<span style="display:none">SME</span><iframe src="http://127.0.0.1:7000" width="100%" height="840px"></iframe>' }
    ],
    'NCC': [
        { isHeader: true, html: '<span style="display:none">Wikipedia NCC</span><iframe src="https://wikipedia.org" width="100%" height="840px"></iframe>' }
    ]
};

// --- Helper: Highlight text in any document (Main or Iframe) ---
function applyHighlight(rootElement, query) {
    // 1. Reset: Remove existing marks
    rootElement.querySelectorAll('mark').forEach(m => {
        const parent = m.parentNode;
        m.replaceWith(document.createTextNode(m.textContent));
        parent.normalize(); // Cleans up text nodes
    });

    if (!query) return;

    // 2. Find and Highlight
    const walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT, null, false);
    const nodes = [];
    let node;
    while (node = walker.nextNode()) nodes.push(node);

    nodes.forEach(textNode => {
        const text = textNode.nodeValue;
        if (text.toLowerCase().includes(query)) {
            const span = document.createElement('span');
            const re = new RegExp(`(${query})`, 'gi');
            span.innerHTML = text.replace(re, '<mark style="background:#ffeb3b; color:black;">$1</mark>');
            textNode.parentNode.replaceChild(span, textNode);
        }
    });
}

// --- Core Page Loader ---
function loadPage(pageName) {
    if (!pageContent[pageName]) return;
    dynamicTitle.innerText = pageName;
    mainGrid.innerHTML = ''; 

    pageContent[pageName].forEach(item => {
        const element = document.createElement('div');
        
        if (item.isHeader) {
            element.className = 'section-header';
            element.style.gridColumn = "1 / -1"; // Full width
            element.innerHTML = `
                <div class="header-content">${item.html}</div>
                <div class="hidden-search-bank" style="display:none;"></div>
            `;
        } else {
            element.className = 'card';
            element.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <div class="card-footer">${item.html}</div>
                <div class="hidden-search-bank" style="display:none;"></div>
            `;
        }
        
        mainGrid.appendChild(element);

        // --- Iframe Indexing (Server only) ---
        const iframe = element.querySelector('iframe');
        if (iframe) {
            iframe.onload = function() {
                try {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    if (doc && doc.body) {
                        element.querySelector('.hidden-search-bank').innerText = doc.body.innerText;
                    }
                } catch (e) { /* Cross-origin block for Wikipedia/SME */ }
            };
        }
    });
}

// --- Navigation ---
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        loadPage(link.getAttribute('data-page'));
    });
});

// --- Combined Search & Deep Highlight ---
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const mainText = card.innerText.toLowerCase();
        const hiddenBank = card.querySelector('.hidden-search-bank').innerText.toLowerCase();
        
        if (mainText.includes(query) || hiddenBank.includes(query)) {
            card.style.display = 'block';
            
            // Highlight Main Card
            applyHighlight(card.querySelector('h3'), query);
            applyHighlight(card.querySelector('p'), query);

            // Highlight INSIDE Iframe (External injection)
            const iframe = card.querySelector('iframe');
            if (iframe) {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    applyHighlight(iframeDoc.body, query);
                } catch (e) { /* Cross-origin block */ }
            }
        } else {
            card.style.display = 'none';
        }
    });
});

// --- Screenshot Function ---
async function downloadScreenshot() {
    if (typeof html2canvas === 'undefined') {
        alert("Library not loaded.");
        return;
    }

    const dashboard = document.querySelector('.app-container');
    const btn = document.querySelector('.capture-btn');
    const originalText = btn.innerText;
    
    btn.innerText = "Capturing...";

    try {
        const canvas = await html2canvas(dashboard, {
            scale: 2,
            useCORS: true,      
            allowTaint: false,  
            backgroundColor: "#f8fafc",
            onclone: (clonedDoc) => {
                const iframes = clonedDoc.getElementsByTagName('iframe');
                for (let i = 0; i < iframes.length; i++) {
                    iframes[i].style.display = 'block';
                }
            }
        });

        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = `UPSS-Dash-${Date.now()}.png`;
        link.href = image;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (err) {
        console.error("Capture Error:", err);
        alert("Security Error: Browser blocked capturing cross-origin iframe content.");
    } finally {
        btn.innerText = originalText;
    }
}

function reloadClear() {
    window.localStorage.clear();
    window.location.reload(true);
}

loadPage('Overview');

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