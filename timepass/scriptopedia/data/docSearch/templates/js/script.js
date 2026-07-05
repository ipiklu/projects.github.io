document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const buttonWrapper = document.getElementById('buttonWrapper');
    const searchBtn = document.getElementById('searchBtn');
    const btnText = document.getElementById('btnText');
    const loadingDots = document.getElementById('loadingDots');
    const resultsContainer = document.getElementById('resultsContainer');
    
    // Modal & Dialog Controller DOM Node References
    const docModal = document.getElementById('docModal');
    const openModalBtn = document.getElementById('openModalBtn');
	const modalOverlay = document.querySelector('.modal-overlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const filterStatusLabel = document.getElementById('filterStatusLabel');
    const selectAllDocs = document.getElementById('selectAllDocs');
    const individualDocsContainer = document.getElementById('individualDocsContainer');

// Function to smoothly open the modal
function openModal() {
    modalOverlay.classList.add('is-active');
}

// Function to smoothly close the modal
function closeModal() {
    modalOverlay.classList.remove('is-active');
}

// Hook Up Modal Visibility Triggers
if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
        docModal.showModal();
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        docModal.close();
    });
}

    // Initialize display state
    resultsContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); font-size: 14px; margin-top: 20px; font-style: italic;">
            Enter a search term above to begin parsing documents.
        </div>
    `;

    // Hook Up Modal Visibility Triggers
    if (openModalBtn) openModalBtn.addEventListener('click', () => docModal.showModal());
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => docModal.close());

    // 1. Fetch available files from your inventory backend mapper
    fetch('/api/documents')
        .then(res => {
            if (!res.ok) throw new Error("Document routing endpoint unreachable.");
            return res.json();
        })
        .then(files => {
            if (files && files.length > 0) {
                renderCheckboxes(files);
            } else {
                showErrorState("No backend index profiles discovered.");
            }
        })
        .catch(err => {
            console.error(err);
            showErrorState("Failed loading document inventory.");
        });

    // 2. Generate individual long-name element list items in the modal scroll pane
    function renderCheckboxes(filesList) {
        individualDocsContainer.innerHTML = '';

        filesList.forEach(file => {
            const label = document.createElement('label');
            label.className = 'checkbox-item';
            label.innerHTML = `
                <input type="checkbox" value="${encodeURIComponent(file)}" class="doc-checkbox" checked>
                <span>${file}</span>
            `;
            individualDocsContainer.appendChild(label);
        });

        bindCheckboxEvents();
        updateStatusBadge(); // Set preliminary baseline display text
    }

    // 3. Keep Master "ALL" checkbox and Dynamic selection badge in alignment
    function bindCheckboxEvents() {
        const getCheckboxes = () => document.querySelectorAll('.doc-checkbox');

        if (!selectAllDocs) return;

        // Master checkbox updates all child files inside scroll container
        selectAllDocs.onchange = () => {
            getCheckboxes().forEach(cb => cb.checked = selectAllDocs.checked);
            updateStatusBadge();
        };

        // Track clicks safely inside container using event delegation
        individualDocsContainer.addEventListener('change', (e) => {
            if (!e.target.classList.contains('doc-checkbox')) return;

            const boxes = Array.from(getCheckboxes());
            const allChecked = boxes.every(c => c.checked);
            const noneChecked = boxes.every(c => !c.checked);
            
            if (allChecked) {
                selectAllDocs.checked = true;
                selectAllDocs.indeterminate = false;
            } else if (noneChecked) {
                selectAllDocs.checked = false;
                selectAllDocs.indeterminate = false;
            } else {
                selectAllDocs.checked = false;
                selectAllDocs.indeterminate = true; // Visual balance indicator style dash (-)
            }

            updateStatusBadge();
        });
    }

    // Recalculates selected totals to show text status on front dashboard page
    function updateStatusBadge() {
        if (!filterStatusLabel) return;
        const boxes = document.querySelectorAll('.doc-checkbox');
        if (boxes.length === 0) return;

        const totalCount = boxes.length;
        const activeCount = Array.from(boxes).filter(cb => cb.checked).length;

        if (activeCount === totalCount) {
            filterStatusLabel.textContent = "All Documents";
        } else if (activeCount === 0) {
            filterStatusLabel.textContent = "None Selected";
            filterStatusLabel.style.color = "#ea4335";
            return;
        } else {
            filterStatusLabel.textContent = `${activeCount} of ${totalCount} Selected`;
        }
        filterStatusLabel.style.color = ""; // Revert back to style defaults safely
    }

    // Helper to safely escape special characters in user queries to prevent Regex crashes
    function escapeRegex(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // 4. Engine Query Execution Pipeline
    function executeSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        // Visual transition locks
        buttonWrapper.classList.add('searching');
        btnText.style.display = 'none';
        loadingDots.style.display = 'flex';
        resultsContainer.innerHTML = '';

        const docCheckboxes = document.querySelectorAll('.doc-checkbox');
        const activeFiles = Array.from(docCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => decodeURIComponent(cb.value));

        // Validation edge case: abort if user cleared all boxes inside the popup
        if (activeFiles.length === 0) {
            resultsContainer.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); font-size: 14px; margin-top: 20px; font-style: italic;">
                    Please click "Configure Profiles" and select at least one target document profile before searching.
                </div>
            `;
            resetButtonState();
            return;
        }

        let targetUrl = `/api/search?q=${encodeURIComponent(query)}`;
        if (selectAllDocs && !selectAllDocs.checked) {
            targetUrl += `&files=${encodeURIComponent(activeFiles.join(','))}`;
        }

        const startTime = Date.now();

        fetch(targetUrl)
            .then(res => {
                if (!res.ok) throw new Error("Search engine calculation malfunction.");
                return res.json();
            })
            .then(data => {
                // Configurable Animation Delay Buffer: set to 900ms minimum runtime length tracking
                const elapsedTime = Date.now() - startTime;
                const remainingDelay = Math.max(0, 5000 - elapsedTime);

                setTimeout(() => {
                    if (!data || data.length === 0) {
                        resultsContainer.innerHTML = `
                            <div style="text-align: center; color: var(--text-muted); font-size: 14px; margin-top: 20px; font-style: italic;">
                                No text segment allocations mapped inside chosen indices.
                            </div>
                        `;
                        resetButtonState();
                        return;
                    }

                    // Safe rendering loop with rigorous null/undefined field guards
                    resultsContainer.innerHTML = data.map(item => {
                        const docName = item.document || 'Unknown Document';
                        
                        // FIX: Guard against missing snippet property or field naming differences
                        // Fallback to item.description or item.text if your backend keys vary
                        const rawSnippet = item.snippet || item.description || item.text || '';
                        
                        let markedSnippet = rawSnippet;
                        if (rawSnippet) {
                            const cleanQuery = escapeRegex(query);
                            const highlightRegex = new RegExp(`(${cleanQuery})`, 'gi');
                            markedSnippet = rawSnippet.replace(highlightRegex, '<span class="match-highlight">$1</span>');
                        }

                        return `
                            <div class="result-item">
                                <h3>\u{1F4C4} ${docName}</h3>
                                <p>... ${markedSnippet || 'No descriptive preview snippet text available.'} ...</p>
                            </div>
                        `;
                    }).join('');

                    resetButtonState();
                }, remainingDelay);
            })
            .catch(err => {
                console.error("Pipeline failure trace:", err);
                resultsContainer.innerHTML = `
                    <div style="text-align: center; color: #ea4335; font-size: 14px; margin-top: 20px;">
                        Error running deep query processing matrix. Check console pipelines.
                    </div>
                `;
                resetButtonState();
            });
    }

    function resetButtonState() {
        if (buttonWrapper) buttonWrapper.classList.remove('searching');
        if (loadingDots) loadingDots.style.display = 'none';
        if (btnText) btnText.style.display = 'inline';
    }

    function showErrorState(msg) {
        if (filterStatusLabel) filterStatusLabel.textContent = "Error loading context paths.";
        if (individualDocsContainer) {
            individualDocsContainer.innerHTML = `<span style="color: #ea4335; font-size: 13px; font-style: italic;">${msg}</span>`;
        }
    }

    // Structural Action Trigger Hooks
    if (searchBtn) searchBtn.addEventListener('click', executeSearch);
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') executeSearch();
        });
    }
});

