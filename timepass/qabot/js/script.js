// JavaScript Document
        const fileInput = document.getElementById('fileInput');
        const chatInput = document.getElementById('chatInput');
        const chatForm = document.getElementById('chatForm');
        const chatLog = document.getElementById('chatLog');
        const statusMessage = document.getElementById('statusMessage');
        const loadingIndicator = document.getElementById('loadingIndicator');
        const sendButton = document.getElementById('sendButton');
        const scrollAnchor = document.getElementById('scrollAnchor');

        let documentContent = null;
        // IMPORTANT: Replace the empty string below with your actual API key
        const apiKey = "AIzaSyC1v5siNaYiwV5H8xgRq13cIbIP6KKxf0o";
        const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=" + apiKey;

        const MAX_DOCUMENT_LENGTH = 90000; // An approximate token limit for the model

        function showMessageBox(title, message) {
            document.getElementById('messageBoxTitle').textContent = title;
            document.getElementById('messageBoxContent').textContent = message;
            document.getElementById('messageBox').style.display = 'flex';
        }

        function hideMessageBox() {
            document.getElementById('messageBox').style.display = 'none';
        }

        function scrollToBottom() {
            // Use scrollIntoView on the anchor element for guaranteed scrolling
            scrollAnchor.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }

        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
            messageDiv.innerHTML = `
                <div class="chat-message ${sender} p-4 rounded-2xl max-w-md shadow-sm whitespace-pre-wrap">
                    ${text}
                </div>
            `;
            chatLog.insertBefore(messageDiv, scrollAnchor);
            scrollToBottom();
        }

        function showLoading(show) {
            if (show) {
                const typingIndicator = document.createElement('div');
                typingIndicator.id = 'typingIndicator';
                typingIndicator.className = 'flex justify-start';
                typingIndicator.innerHTML = `
                    <div class="chat-message bot p-4 rounded-2xl max-w-md shadow-sm">
                        <div class="flex items-center space-x-1">
                            <span class="loading-dot w-2 h-2 bg-gray-500 rounded-full"></span>
                            <span class="loading-dot w-2 h-2 bg-gray-500 rounded-full"></span>
                            <span class="loading-dot w-2 h-2 bg-gray-500 rounded-full"></span>
                        </div>
                    </div>
                `;
                chatLog.insertBefore(typingIndicator, scrollAnchor);
                scrollToBottom();
                sendButton.disabled = true;
                chatInput.disabled = true;
            } else {
                const indicator = document.getElementById('typingIndicator');
                if (indicator) {
                    indicator.remove();
                }
                sendButton.disabled = false;
                chatInput.disabled = false;
                chatInput.focus();
            }
        }

        async function processPDF(file) {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.onload = async function() {
                    const typedarray = new Uint8Array(this.result);
                    try {
                        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                        let fullText = '';
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const textContent = await page.getTextContent();
                            const pageText = textContent.items.map(item => item.str).join(' ');
                            fullText += pageText + ' ';
                        }
                        resolve(fullText);
                    } catch (error) {
                        reject('Failed to process PDF file.');
                    }
                };
                fileReader.readAsArrayBuffer(file);
            });
        }

        async function processDOCX(file) {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.onload = function() {
                    const arrayBuffer = this.result;
                    mammoth.extractRawText({ arrayBuffer: arrayBuffer })
                        .then(result => resolve(result.value))
                        .catch(err => reject('Failed to process DOCX file.'));
                };
                fileReader.readAsArrayBuffer(file);
            });
        }

        async function processTXT(file) {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.onload = function() {
                    resolve(this.result);
                };
                fileReader.readAsText(file);
            });
        }

        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) {
                return;
            }

            documentContent = null;
            statusMessage.textContent = 'Processing file...';
            loadingIndicator.classList.remove('hidden');
            chatInput.disabled = true;
            sendButton.disabled = true;

            try {
                const fileType = file.name.split('.').pop().toLowerCase();
                let text = '';
                if (fileType === 'pdf') {
                    text = await processPDF(file);
                } else if (fileType === 'docx') {
                    text = await processDOCX(file);
                } else if (fileType === 'txt') {
                    text = await processTXT(file);
                } else {
                    showMessageBox('Unsupported File', 'Please upload a .txt, .pdf, or .docx file.');
                    statusMessage.textContent = '';
                    return;
                }

                if (text.length > MAX_DOCUMENT_LENGTH) {
                    showMessageBox('Document Too Large', 'The document is too large to be processed by the model. Please upload a smaller file.');
                    statusMessage.textContent = '';
                    return;
                }

                documentContent = text;
                statusMessage.textContent = `File "${file.name}" processed successfully. You can now ask questions.`;
                chatInput.disabled = false;
                sendButton.disabled = false;
                chatInput.focus();

            } catch (error) {
                console.error('File processing error:', error);
                showMessageBox('Processing Error', `An error occurred while processing the file: ${error}`);
                statusMessage.textContent = '';
            } finally {
                loadingIndicator.classList.add('hidden');
            }
        });

        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userMessage = chatInput.value.trim();

            if (!userMessage) {
                return;
            }
            if (!documentContent) {
                showMessageBox('No Document Uploaded', 'Please upload a document before asking a question.');
                return;
            }

            addMessage(userMessage, 'user');
            chatInput.value = '';
            showLoading(true);

            try {
                let response = null;
                let retries = 0;
                const maxRetries = 3;
                while (retries < maxRetries) {
                    try {
                        const payload = {
                            contents: [{
                                parts: [{
                                    text: `Based on the following document content, answer the question accurately and concisely. Do not use outside knowledge. If the answer is not in the document, state that you cannot find the answer. \n\nDocument: ${documentContent}\n\nQuestion: ${userMessage}`
                                }]
                            }]
                        };

                        const fetchResponse = await fetch(apiUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });

                        if (!fetchResponse.ok) {
                            console.error(`API Error: ${fetchResponse.status} - ${fetchResponse.statusText}`);
                            if (fetchResponse.status === 429) {
                                retries++;
                                await new Promise(res => setTimeout(res, 2 ** retries * 1000));
                                continue;
                            } else {
                                throw new Error(`API returned status code ${fetchResponse.status}`);
                            }
                        }

                        const result = await fetchResponse.json();
                        response = result.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't find an answer to that question in the document.";
                        break;
                    } catch (err) {
                        retries++;
                        console.error('API call failed, retrying:', err);
                        await new Promise(res => setTimeout(res, 2 ** retries * 1000));
                    }
                }

                if (response) {
                    addMessage(response, 'bot');
                } else {
                    addMessage("I'm sorry, I couldn't get a response. Please check your API key and try again.", 'bot');
                }

            } catch (error) {
                console.error('API Error:', error);
                addMessage('An error occurred while fetching the response. Please check your API key and try again.', 'bot');
            } finally {
                showLoading(false);
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
