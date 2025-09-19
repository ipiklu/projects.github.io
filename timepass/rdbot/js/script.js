// Store the full document text for searching
let documentText = '';
let fileName = '';

const fileInput = document.getElementById('fileInput');
const searchPhraseInput = document.getElementById('searchPhrase');
const searchButton = document.getElementById('searchButton');
const statusMessage = document.getElementById('statusMessage');
const resultsContainer = document.getElementById('resultsContainer');

function showMessageBox(title, content) {
    const messageBox = document.getElementById('messageBox');
    document.getElementById('messageBoxTitle').textContent = title;
    document.getElementById('messageBoxContent').textContent = content;
    messageBox.style.display = 'flex';
}

function hideMessageBox() {
    const messageBox = document.getElementById('messageBox');
    messageBox.style.display = 'none';
}

async function readPdf(file) {
    const loadingTask = pdfjsLib.getDocument(URL.createObjectURL(file));
    const pdf = await loadingTask.promise;
    let textContent = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        textContent += text.items.map(item => item.str).join(' ') + ' ';
    }
    return textContent;
}

async function readDocx(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return result.value;
}

async function readTxt(file) {
    return await file.text();
}

fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) {
        searchPhraseInput.disabled = true;
        searchButton.disabled = true;
        statusMessage.textContent = '';
        return;
    }

    fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    documentText = '';
    statusMessage.textContent = 'Loading file...';
    resultsContainer.innerHTML = '<p class="text-gray-500 text-sm">Loading...</p>';
    searchPhraseInput.disabled = true;
    searchButton.disabled = true;

    try {
        switch (fileExtension) {
            case 'pdf':
                documentText = await readPdf(file);
                break;
            case 'docx':
                documentText = await readDocx(file);
                break;
            case 'txt':
                documentText = await readTxt(file);
                break;
            default:
                showMessageBox('Error', 'Unsupported file type. Please upload a .txt, .pdf, or .docx file.');
                statusMessage.textContent = '';
                return;
        }
        statusMessage.textContent = `File "${fileName}" loaded successfully.`;
        searchPhraseInput.disabled = false;
        searchButton.disabled = false;
        searchPhraseInput.focus();
        resultsContainer.innerHTML = '<p class="text-gray-500 text-sm">Results will appear here.</p>';

    } catch (error) {
        console.error(error);
        showMessageBox('Error', `Failed to load file. Please try again. Details: ${error.message}`);
        statusMessage.textContent = 'Failed to load file.';
        searchPhraseInput.disabled = true;
        searchButton.disabled = true;
        resultsContainer.innerHTML = '<p class="text-gray-500 text-sm">An error occurred while loading the file.</p>';
    }
});

// New function to create and append a typing indicator
function showTypingIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator flex items-center space-x-2 p-4 bg-gray-50 rounded-lg shadow-sm';
  indicator.innerHTML = `
    <span class="animate-pulse h-2 w-2 bg-blue-500 rounded-full"></span>
    <span class="animate-pulse h-2 w-2 bg-blue-500 rounded-full" style="animation-delay: 0.2s;"></span>
    <span class="animate-pulse h-2 w-2 bg-blue-500 rounded-full" style="animation-delay: 0.4s;"></span>
  `;
  resultsContainer.appendChild(indicator);
  return indicator;
}

// Modified findPhrase to include the typing indicator
function findPhrase() {
    const phrase = searchPhraseInput.value.trim();
    if (!phrase) {
        showMessageBox('Please enter a phrase', 'The search phrase cannot be empty.');
        return;
    }

    if (!documentText) {
        showMessageBox('No document loaded', 'Please upload a document before searching.');
        return;
    }

    resultsContainer.innerHTML = '';
    const typingIndicator = showTypingIndicator();

    setTimeout(() => {
        resultsContainer.removeChild(typingIndicator);

        const regex = new RegExp(phrase, 'gi'); // 'g' for global, 'i' for case-insensitive
        let match;
        const matches = [];

        while ((match = regex.exec(documentText)) !== null) {
            matches.push({
                text: match[0],
                index: match.index
            });
        }
        displayResults(matches, phrase);
    }, 2500); // 2.5 second delay to simulate search time
}

function displayResults(matches, phrase) {
    resultsContainer.innerHTML = '';
    if (matches.length === 0) {
        resultsContainer.innerHTML = `<p class="text-gray-500 text-sm">No matches found for "${phrase}".</p>`;
        return;
    }

    const phraseLower = phrase.toLowerCase();
    const lines = documentText.split(/\r?\n/);
    const displayedMatches = new Set();
    const maxContextLength = 200;

    matches.forEach(match => {
        let contextStart = Math.max(0, match.index - 50);
        let contextEnd = Math.min(documentText.length, match.index + phrase.length + 50);

        let snippet = documentText.substring(contextStart, contextEnd);

        const highlightedSnippet = snippet.replace(new RegExp(phrase, 'gi'), `<span class="text-highlight font-semibold">${phrase}</span>`);

        const resultDiv = document.createElement('div');
        resultDiv.className = 'p-4 bg-gray-50 rounded-lg shadow-sm chat-container';
        resultDiv.innerHTML = `<p class="text-sm text-gray-700"><span class="font-semibold index">Match found:</span> ...${highlightedSnippet}... </p>`;
        resultsContainer.appendChild(resultDiv);
    });
}
     
// --- Event Listeners ---
searchButton.addEventListener('click', findPhrase);

searchPhraseInput.addEventListener('keydown', (event) => {
    // Check for 'Enter' key press
    if (event.key === 'Enter') {
        findPhrase();
    }
});

// This function will close the current window or tab
function closeWindow() {
  window.close();
}

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