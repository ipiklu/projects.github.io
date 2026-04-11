lucide.createIcons();

// --- 1. Elements ---
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');
const dynamicTitle = document.getElementById('dynamic-title');
const mainGrid = document.getElementById('main-grid');
const navLinks = document.querySelectorAll('.nav-link');
const searchInput = document.getElementById('global-search');
const contentArea = document.querySelector('.content-area');

// --- 2. Unified Interaction Logic (Mouse + Touch + Wheel) ---
let startX = 0;
let isDragging = false;
let lastScrollTop = 0;

// A. Manual Toggle
toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

// B. Mouse Wheel Logic (Global)
window.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) < 5) return; // Ignore accidental micro-scrolls
    if (e.deltaY > 0) sidebar.classList.add('collapsed');
    else sidebar.classList.remove('collapsed');
}, { passive: true });

// C. Unified Drag/Swipe Logic (Mouse + Touch)
let dragStartTime = 0;
const moveThreshold = 10; // Pixels moved before we consider it a "drag"

window.addEventListener('pointerdown', (e) => {
    // 1. Ignore if clicking buttons, inputs, or iframes
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('iframe')) return;
    
    startX = e.pageX;
    dragStartTime = Date.now();
    isDragging = true;
    
    // We DON'T capture the pointer yet to allow the link to register a click
});

// Optional: Prevent default browser behavior ONLY while dragging
window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    
    // Prevent default scroll behavior if we are swiping sideways
    const currentX = e.pageX;
    if (Math.abs(currentX - startX) > 10) {
        // This is only allowed if touch-action is handled in CSS
    }
});

window.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    
    const diffX = e.pageX - startX;
    const dragDuration = Date.now() - dragStartTime;
    const threshold = 50; 

    // Logic: Only toggle if the movement was significant OR lasted long enough
    // This prevents "taps" on sidebar links from being ignored
    if (Math.abs(diffX) > threshold && dragDuration > 100) {
        if (diffX < -threshold) {
            sidebar.classList.add('collapsed');
        } else if (diffX > threshold) {
            sidebar.classList.remove('collapsed');
        }
        
        // If it was a real drag, prevent the click from firing on a link
        e.preventDefault();
    }

    isDragging = false;
});

// D. Internal Content Scroll Logic
contentArea.addEventListener('scroll', () => {
    let st = contentArea.scrollTop;
    if (st > lastScrollTop && st > 30) {
        sidebar.classList.add('collapsed');
    } else if (st < lastScrollTop) {
        sidebar.classList.remove('collapsed');
    }
    lastScrollTop = st <= 0 ? 0 : st;
}, { passive: true });

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

// --- 5. Core Loader & Helpers ---
function loadPage(pageName) {
    if (!pageContent[pageName]) return;
    dynamicTitle.innerText = pageName;
    mainGrid.innerHTML = ''; 

    pageContent[pageName].forEach(item => {
        const element = document.createElement('div');
        element.className = item.isHeader ? 'section-header' : 'card';
        if (item.isHeader) element.style.gridColumn = "1 / -1";
        
        element.innerHTML = `
            ${item.isHeader ? '' : `<h3>${item.title}</h3><p>${item.desc}</p>`}
            <div class="${item.isHeader ? 'header-content' : 'card-footer'}">${item.html}</div>
            <div class="hidden-search-bank" style="display:none;"></div>
        `;
        
        mainGrid.appendChild(element);

        const iframe = element.querySelector('iframe');
        if (iframe) {
            iframe.onload = function() {
                try {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    element.querySelector('.hidden-search-bank').innerText = doc.body.innerText;
                } catch (e) {}
            };
        }
    });
}

function applyHighlight(rootElement, query) {
    rootElement.querySelectorAll('mark').forEach(m => {
        m.replaceWith(document.createTextNode(m.textContent));
    });

    if (!query) return;

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

// --- 6. Event Listeners Init ---
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        loadPage(link.getAttribute('data-page'));
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