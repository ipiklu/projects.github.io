document.getElementById('searchBtn').addEventListener('click', performSearch);
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') performSearch();
});

function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    const resultsDiv = document.getElementById('results');
    const btnWrapper = document.getElementById('searchBtnWrapper');
    const btnText = document.querySelector('.btn-text');
    const loader = document.getElementById('loader');
    
    if (!query) {
        resultsDiv.innerHTML = '<p style="color:#ea4335; font-size: 14px;">Please enter a search term.</p>';
        return;
    }

    // 1. Activate Ultra-Modern Orbit Layout and Jumping Dots Display
    btnWrapper.classList.add('searching');
    btnText.style.display = 'none';
    loader.style.display = 'flex';
    resultsDiv.innerHTML = '';

    // 2. Start both the backend fetch and a minimum display timer concurrently
    const fetchPromise = fetch(`/api/search?q=${encodeURIComponent(query)}`).then(res => res.json());
    const animationDelayPromise = new Promise(resolve => setTimeout(resolve, 5000)); // 800ms minimum window

    // 3. Wait for BOTH to complete before rendering results
    Promise.all([fetchPromise, animationDelayPromise])
        .then(([data]) => {
            // Restore button layout state
            btnWrapper.classList.remove('searching');
            btnText.style.display = 'block';
            loader.style.display = 'none';

            if (data.length === 0) {
                resultsDiv.innerHTML = '<p style="color: var(--text-muted);">No matching descriptive content found in any SOPs.</p>';
                return;
            }
            
            data.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'result-item';
                
                const regex = new RegExp(`(${query})`, 'gi');
                const highlightedText = item.snippet.replace(regex, '<span class="match-highlight">$1</span>');

                itemDiv.innerHTML = `
                    <h3>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--google-blue)"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        ${item.document}
                    </h3>
                    <p>... ${highlightedText} ...</p>
                `;
                resultsDiv.appendChild(itemDiv);
            });
        })
        .catch(err => {
            btnWrapper.classList.remove('searching');
            btnText.style.display = 'block';
            loader.style.display = 'none';
            resultsDiv.innerHTML = '<p style="color: var(--google-rose);">Error connecting to the backend service.</p>';
            console.error(err);
        });
}
