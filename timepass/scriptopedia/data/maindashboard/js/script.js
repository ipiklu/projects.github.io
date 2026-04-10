lucide.createIcons();

// Elements
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');
const dynamicTitle = document.getElementById('dynamic-title');
const mainGrid = document.getElementById('main-grid');
const navLinks = document.querySelectorAll('.nav-link');
const searchInput = document.getElementById('global-search');

// Search Focus/Blur Logic
searchInput.addEventListener("mouseenter", () => searchInput.focus());
searchInput.addEventListener("mouseleave", () => searchInput.blur());

// Toggle Sidebar
toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

// Page Content Data
const pageContent = {
    'Overview': [
        { title: 'Primary Actions', desc: 'Main user interactions.', html: '<button class="btn btn-primary" onClick="window.open(\'https://google.com\', \'_blank\');">Submit</button>' },
        { title: 'Secondary Actions', desc: 'Less critical tasks.', html: '<button class="btn btn-outline">Cancel</button>' }
    ],
    'Provisioning': [
        { title: 'Data Exports', desc: 'Download your reports here.', html: '<button class="btn btn-outline">Download CSV</button>' }
    ],
    'IR': [
        { title: 'Management', desc: 'Danger zone actions.', html: '<button class="btn btn-danger">Delete Project</button>' }
    ],
    'Config': [
        { title: 'Account Settings', desc: 'Update your global profile.', html: '<button class="btn btn-primary">Save Settings</button>' }
    ]
};

function loadPage(pageName) {
    dynamicTitle.innerText = pageName;
    mainGrid.innerHTML = '';
    
    if(!pageContent[pageName]) return;

    pageContent[pageName].forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-title', item.title);
        card.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
            <div class="card-footer">${item.html}</div>
        `;
        mainGrid.appendChild(card);
    });
}

// Event Listeners
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        loadPage(link.getAttribute('data-page'));
    });
});

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        card.style.display = title.includes(query) ? 'block' : 'none';
    });
});

// Initialize
loadPage('Overview');

// SCREENSHOT FUNCTION
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
            useCORS: true,      // Essential for Server/Web
            allowTaint: false,   // Must be false if useCORS is true
            logging: true,
            backgroundColor: "#f8fafc",
            // This flag helps with local images that might be causing the taint
            proxy: null,
            ignoreElements: (element) => {
                // If a specific image keeps failing, you can ignore it here
                // return element.tagName === 'IMG'; 
                return false;
            }
        });

        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = `UPSS-Dash-${Date.now()}.png`;
        link.href = image;
        link.click();

    } catch (err) {
        console.error("Capture Error:", err);
        alert("Security Error: Try running this through a 'Live Server' or web host.");
    } finally {
        btn.innerText = originalText;
    }
}