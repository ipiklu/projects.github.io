// JavaScript Document

	// 1. Function to split text into tokens (character-by-character for prefix matching)
	function tokenize(text) {
		return Array.from(text);
	}
	
	// Helper function to escape HTML special characters for safe display
	function escapeHTML(str) {
		return str.replace(/&/g, '&amp;')
				  .replace(/</g, '&lt;')
				  .replace(/>/g, '&gt;')
				  .replace(/"/g, '&quot;')
				  .replace(/'/g, '&#039;');
	}
	
	// 2. Main Comparison and Highlighting Function
	function compareTexts() {
		const textarea1 = document.getElementById('text1');
		const textarea2 = document.getElementById('text2');
		const content1 = document.getElementById('content1');
		const content2 = document.getElementById('content2');
		const diffTitle = document.getElementById('diff-report-title'); // New reference
		const diffOutput = document.getElementById('difference-output');
		
		const textA = textarea1.value;
		const textB = textarea2.value;
	
		// --- Part 1: Real-Time Character-Level Highlighting (as before) ---
	
		// Tokenize character-by-character
		const tokensA = tokenize(textA);
		const tokensB = tokenize(textB);
		
		const minLen = Math.min(tokensA.length, tokensB.length);
		
		let mismatchIndex = -1;
		
		// Step 1: Find the first point of mismatch
		for (let i = 0; i < minLen; i++) {
			if (tokensA[i] !== tokensB[i]) {
				mismatchIndex = i;
				break;
			}
		}
		
		// Set mismatchIndex to the length of the shorter string if no difference is found up to that point
		if (mismatchIndex === -1) {
			mismatchIndex = minLen;
		}
		
		// Step 2: Build the highlighted HTML strings
		let htmlA = '';
		let htmlB = '';
		
		const maxLength = Math.max(tokensA.length, tokensB.length);
	
		for (let i = 0; i < maxLength; i++) {
			const tokenA = tokensA[i] || '';
			const tokenB = tokensB[i] || '';
			
			let tokenClass = '';
	
			if (i < mismatchIndex) {
				// Match found in the common prefix (Green)
				// Only apply highlight class if the token is not an empty space/newline that shouldn't be highlighted
				tokenClass = tokenA.trim() !== '' || tokenA === ' ' ? 'prefix-matched' : '';
				
				htmlA += `<span class="${tokenClass}">${tokenA}</span>`;
				htmlB += `<span class="${tokenClass}">${tokenB}</span>`;
			} else {
				// Mismatch or text extends past the shorter string (Red)
				tokenClass = 'mismatched';
				
				if (tokenA !== '') {
					htmlA += `<span class="${tokenClass}">${tokenA}</span>`;
				}
				if (tokenB !== '') {
					htmlB += `<span class="${tokenClass}">${tokenB}</span>`;
				}
			}
		}
	
		// Step 3: Update the Overlays and Synchronize Scroll
		content1.innerHTML = htmlA;
		content2.innerHTML = htmlB;
		
		content1.scrollTop = textarea1.scrollTop;
		content2.scrollTop = textarea2.scrollTop;
	
		// --- Part 2: Line-Level Difference Report Generation ---
		const linesA = textA.split('\n');
		const linesB = textB.split('\n');
		const maxLines = Math.max(linesA.length, linesB.length);
	
		let diffHTML = '';
		let hasDifferences = false;
	
		for (let i = 0; i < maxLines; i++) {
			const lineA = linesA[i] !== undefined ? linesA[i] : '';
			const lineB = linesB[i] !== undefined ? linesB[i] : '';
			const lineNumber = i + 1;
	
			if (lineA !== lineB) {
				hasDifferences = true;
				diffHTML += `<div class="diff-line">`;
				diffHTML += `<span class="line-number">Line ${lineNumber}</span>`;
	
				if (lineA && lineB) {
					// Lines exist in both but are different (Modification)
					diffHTML += `<span class="index">Left-Area: </span>`;
					diffHTML += `<span class="diff-type-removed">${escapeHTML(lineA)}</span>`;
					diffHTML += `<span class="index"> || Right-Area: </span>`;
					diffHTML += `<span class="diff-type-added">${escapeHTML(lineB)}</span>`;
				} else if (lineA && !lineB) {
					// Line exists only in A (Removal/Shorter B)
					diffHTML += `<span class="index">Only-Left-Area: </span>`;
					diffHTML += `<span class="diff-type-removed">${escapeHTML(lineA)}</span>`;
				} else if (!lineA && lineB) {
					// Line exists only in B (Addition/Longer B)
					diffHTML += `<span class="index">Only-Right-Area: </span>`;
					diffHTML += `<span class="diff-type-added">${escapeHTML(lineB)}</span>`;
				}
				
				diffHTML += `</div>`;
			}
		}
	
		if (!hasDifferences && (textA || textB)) {
			diffOutput.innerHTML = '<p class="initial-message">✅ Texts are identical up to their current length.</p>';
		} else if (!textA && !textB) {
			diffOutput.innerHTML = '<p class="initial-message">Start typing to see the line-by-line comparison results.</p>';
		} else {
			diffOutput.innerHTML = diffHTML;
		}
		
	// Check if both textareas are empty (to keep the report hidden)
		const textsAreEmpty = !textA && !textB;
		
		if (textsAreEmpty) {
			// If both are empty, hide the report section
			diffTitle.style.display = 'none';
			diffOutput.style.display = 'none';
			diffOutput.innerHTML = '<p class="initial-message">Start typing to see the line-by-line comparison results.</p>';
			return; // Exit the function
		}
	
		// If text exists, determine content and visibility
		if (!hasDifferences) {
			// If text exists but no differences found
			diffTitle.style.display = 'block'; // Show title
			diffOutput.style.display = 'block'; // Show output area
			diffOutput.innerHTML = '<p class="initial-message index"><img src="img/green-white.gif" style="max-width:10px" /> Texts are identical up to their current length.</p>';
		} else {
			// Differences found
			diffTitle.style.display = 'block'; // Show title
			diffOutput.style.display = 'block'; // Show output area
			diffOutput.innerHTML = diffHTML;
		}		
	
	}
	
	// --- Event Listeners ---
	document.getElementById('text1').addEventListener('input', compareTexts);
	document.getElementById('text2').addEventListener('input', compareTexts);
	// Keep scroll listeners for synchronization
	document.getElementById('text1').addEventListener('scroll', compareTexts);
	document.getElementById('text2').addEventListener('scroll', compareTexts);
	
	// Initial call to set up the view
	compareTexts();

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