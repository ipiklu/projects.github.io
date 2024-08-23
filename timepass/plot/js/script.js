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
		
 <!---POPUP Coustomization---> 
	  function view() {
          alertify.alert("<a href='https://www.linkedin.com/in/sayantan-kundu-52650758' target='_blank'><img src='img/linkedin.png' style='max-width: 90%; max-height: 70%'/></a><br/><a href='https://twitter.com/piklu21' target='_blank'><img src='img/twitter.png' style='max-width: 30%; max-height: 30%'/></a><a href='https://www.facebook.com/kundupiklu' target='_blank'><img src='img/facebook.jpg' style='max-width: 30%; max-height: 30%'/> </a><a href='https://www.instagram.com/i_piklu/' target='_blank'><img src='img/instagram.png' style='max-width: 30%; max-height: 30%'/></a><p style='color:#AA205C; font-style:italic; font-weight:bolder; font-size:25px' />STAY HOME, STAY SAFE.</p><p style='color:#AA205C; font-style:italic; font-weight:bolder; font-size:25px' />#Covid-19 #HomeQuarantine</p>");
          return false;
    }