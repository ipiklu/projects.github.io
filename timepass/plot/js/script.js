// JavaScript Document

function plotGraph() { 
			const graph = document.getElementById('graph'); 
			graph.innerHTML = ''; 

			const functionInput = 
				document.getElementById('functionInput').value; 
			const expr = math.parse(functionInput).compile(); 

			const xValues = math.range(-10, 10, 0.1)._data; 
			const yValues = xValues.map(x => expr.evaluate({ x })); 

			const trace = { 
				x: xValues, 
				y: yValues, 
				type: 'scatter', 
				mode: 'lines', 
			}; 

			const layout = { 
				xaxis: { title: 'X-axis' }, 
				yaxis: { title: 'Y-axis' }, 
			}; 

			Plotly.newPlot(graph, [trace], layout); 
		}
// Dim screen functionality	----Start	
 const INACTIVITY_DURATION = 10000; // 10 seconds
 const body = document.body;
 let inactivityTimer;

 function activateDarkMode() {
      body.classList.add('dark-mode');
      console.log("Dark mode activated due to inactivity.");
 }

        function resetTimer() {
            // 1. Clear the previous timer
            clearTimeout(inactivityTimer);

            // 2. Deactivate dark mode
            if (body.classList.contains('dark-mode')) {
                body.classList.remove('dark-mode');
                console.log("Timer reset, dark mode deactivated.");
            }

            // 3. Set a new timer
            inactivityTimer = setTimeout(activateDarkMode, INACTIVITY_DURATION);
        }

        // Start the initial timer
        resetTimer();

        // Event listener to reset the timer on mouse movement
        document.addEventListener('mousemove', resetTimer);
        // Optional: Also reset on keypress
        document.addEventListener('keydown', resetTimer);		
// Dim screen functionality	-----End
		
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