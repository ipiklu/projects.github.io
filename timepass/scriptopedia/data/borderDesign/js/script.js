// JavaScript Document

// Function to handle the actual copying
function copyCodeToClipboard() {
    const codeText = document.querySelector('.index-alert').innerText;
    
    navigator.clipboard.writeText(codeText).then(() => {
        // Optional: Change the button text temporarily to show success
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = "&#x2714;";
		alertify.success("Copied!");
        setTimeout(() => { btn.innerHTML = originalText; }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

<!---POPUP Rectengle card Coustomization---> 
	  function rectangleCardView() {
          alertify.alert(`
		  <div class="popup-wrapper" style="position:relative;">
            <button class="copy-btn" onclick="copyCodeToClipboard()"
				title="Click-To-Copy"
                style="position: absolute; right: 10px; top: 10px; z-index: 10; cursor: pointer; background: tranparent; border: none; outline: none; 
					   color: white; padding: 5px 10px; border-radius: 5px;">&#10065;
            </button>
            <div class="code-scroll-container">
                <pre>
					<code class="index-alert">
						/* --- CUSTOM PROPERTY DEFINITION --- */
						@property --gradient-angle {
							syntax: "&lt;angle&gt;";
							initial-value: 0deg;
							inherits: false;
						}
						
						/* --- THEME VARIABLES --- */
						:root {
							--bg-color: #050505;
							--card-bg: #111;
							--glow-color-1: #5ddcff;
							--glow-color-2: #3c67e3;
							--glow-color-3: #4e00c2;
						}
						
						/* --- CARD BASE STYLES --- */
						.glow-card {
							position: relative;
							width: 280px;
							height: 380px;
							background: var(--card-bg);
							border-radius: 20px;
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							text-align: center;
							padding: 20px;
						}
						
						/* --- ANIMATED BORDER LAYER --- */
						.glow-card::before, 
						.glow-card::after {
							content: "";
							position: absolute;
							inset: -4px; /* Thickness of the border */
							z-index: -1;
							background: conic-gradient(
								from var(--gradient-angle),
								var(--glow-color-1),
								var(--glow-color-2),
								var(--glow-color-3),
								var(--glow-color-2),
								var(--glow-color-1)
							);
							border-radius: inherit;
							animation: rotation 3s linear infinite;
						}
						
						/* --- GLOW EFFECT LAYER --- */
						.glow-card::after {
							filter: blur(25px);
							opacity: 0.6;
						}
						
						/* --- ANIMATION KEYFRAMES --- */
						@keyframes rotation {
							0% { --gradient-angle: 0deg; }
							100% { --gradient-angle: 360deg; }
						}
					</code>
				</pre>
            </div>
		</div>	
        `);
          return false;
    }
	
	<!---POPUP Circle card Coustomization---> 
	  function circleCardView() {
          alertify.alert(`
		  <div class="popup-wrapper" style="position:relative;">
            <button class="copy-btn" onclick="copyCodeToClipboard()"
				title="Click-To-Copy"
                style="position: absolute; right: 10px; top: 10px; z-index: 10; cursor: pointer; background: tranparent; border: none; outline: none; 
					   color: white; padding: 5px 10px; border-radius: 5px;">&#10065;
            </button>
            <div class="code-scroll-container">
                <pre>
					<code class="index-alert">
						/* --- CUSTOM PROPERTY DEFINITION --- */
						@property --gradient-angle {
							syntax: "&lt;angle&gt;";
							initial-value: 0deg;
							inherits: false;
						}
						
						/* --- Circle BASE STYLES --- */
						.glow-circle {
							position: relative;
							width: 150px;
							height: 150px;
							background: #000;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
						}
						
						/* --- ANIMATED Circle BORDER LAYER --- */
						.glow-circle::before {
							content: "";
							position: absolute;
							inset: -3px;
							border-radius: 50%;
							padding: 3px; /* border thickness */
							background: conic-gradient(
								from var(--gradient-angle),
								#ffcc00,
								#ff6600,
								#ff0033,
								#3045F0,
								#69EC6F,
								transparent 99%
							);
							
							/* This is the magic: it hides the middle, leaving only the border */
							-webkit-mask: 
								linear-gradient(#fff 0 0) content-box, 
								linear-gradient(#fff 0 0);
							mask: 
								linear-gradient(#fff 0 0) content-box, 
								linear-gradient(#fff 0 0);
							-webkit-mask-composite: xor;
							mask-composite: exclude;
							
							animation: rotation 2s linear infinite;
							filter: drop-shadow(0 0 10px #ff6600);
						}
						
						/* --- ANIMATION KEYFRAMES --- */
						@keyframes rotation {
							0% { --gradient-angle: 0deg; }
							100% { --gradient-angle: 360deg; }
						}
					</code>
				</pre>
            </div>
		</div>	
        `);
          return false;
    }