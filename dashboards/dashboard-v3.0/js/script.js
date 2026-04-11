lucide.createIcons();

// --- Elements ---
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');
const dynamicTitle = document.getElementById('dynamic-title');
const mainGrid = document.getElementById('main-grid');
const navLinks = document.querySelectorAll('.nav-link');
const searchInput = document.getElementById('global-search');

// --- Search Focus Logic ---
searchInput.addEventListener("mouseenter", () => searchInput.focus());
searchInput.addEventListener("mouseleave", () => searchInput.blur());

// --- Toggle Sidebar ---
toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

// --- Page Content Data ---
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

// --- Initialize ---
loadPage('Overview');

// --- Reload ---
function reloadClear() {
    window.localStorage.clear();
    window.location.reload(true);
    return false;
}