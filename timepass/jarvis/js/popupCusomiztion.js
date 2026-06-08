// POP up JavaScript Document


<!---POPUP creator's profile Coustomization--->
function view() {
    alertify.alert(`
        <div style="display:flex; justify-content:center; margin-bottom: 10px;">
            <a href="https://www.linkedin.com/in/sayantan-kundu-52650758" target="_blank">
                <img src="img/linkedin.png" style="max-width: 100%; max-height: 100%;" alt="LinkedIn"/>
            </a>
        </div>
        <div style="display:flex; justify-content:center; align-items:center; gap: 20px; margin-top: 10px;">
            <a href="https://twitter.com/piklu21" target="_blank">
                <img src="img/twitter.png" style="max-width: 150px; width: 100%; height: auto;" alt="Twitter"/>
            </a>
            <a href="https://www.facebook.com/kundupiklu" target="_blank">
                <img src="img/facebook.jpg" style="max-width: 150px; width: 100%; height: auto;" alt="Facebook"/> 
            </a>
            <a href="https://www.instagram.com/i_piklu/" target="_blank">
                <img src="img/instagram.png" style="max-width: 150px; width: 100%; height: auto;" alt="Instagram"/>
            </a>
        </div>
        <p class="index-alert" style="font-style:italic; font-weight:bolder; font-size:25px;">STAY HOME, STAY SAFE.</p>
        <p class="index-alert" style="font-style:italic; font-weight:bolder; font-size:25px;">#Covid-19 #HomeQuarantine</p>
    `);
    return false;
}

<!---POPUP commands that can be given to JARVIS---> 
	  function commadsView() {
          alertify.alert(`
		  		<div class="popup-wrapper" style="position:relative;">
            		<div class="code-scroll-container">
						<table width="400" border="2" bordercolor="#AA205C">
							<thead> 
								<tr align="center">
									<th class="zone-cell" colspan="3">ALLOWED-COMMANDS</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td width="38" align="center">
										<a class="index-alert" style="cursor: not-allowed;">1</a>
									</td>
									<td align="left">
										<a class="index-alert" style="cursor: not-allowed;">Time</a>
									</td>
								</tr>
								<tr>
									<td width="38" align="center">
										<a class="index-alert" style="cursor: not-allowed;">2</a>
									</td>
									<td align="left" align="center">
										<a class="index-alert" style="cursor: not-allowed;">Day</a>
									</td>
								</tr>
								<tr>
									<td width="38" align="center">
										<a class="index-alert" style="cursor: not-allowed;">3</a>
									</td>
									<td align="left">
										<a class="index-alert" style="cursor: not-allowed;">Calculate my age</a>
									</td>
								</tr>
								<tr>
									<td width="38" align="center">
										<a class="index-alert" style="cursor: not-allowed;">4</a>
									</td>
									<td align="left">
										<a class="index-alert" style="cursor: not-allowed;">Do a calculation</a>
									</td>
								</tr>
								<tr>
									<td width="38" align="center">
										<a class="index-alert" style="cursor: not-allowed;">5</a>
									</td>
									<td align="left">
										<a class="index-alert" style="cursor: not-allowed;">Track location</a>
									</td>
								</tr>
								<tr>
									<td width="38" align="center">
										<a class="index-alert" style="cursor: not-allowed;">6</a>
									</td>
									<td align="left">
										<a class="index-alert" style="cursor: not-allowed;">Calculate my age</a>
									</td>
								</tr>
								<tr>
									<td width="38" align="center">
										<a class="index-alert" style="cursor: not-allowed;">7</a>
									</td>
									<td align="left">
										<a class="index-alert" style="cursor: not-allowed;">Capture me</a>
									</td>
								</tr>
								<tr>
									<td width="38" align="center">
										<a class="index-alert" style="cursor: not-allowed;">8</a>
									</td>
									<td align="left">
										<a class="index-alert" style="cursor: not-allowed;">Open Maps</a>
									</td>
								</tr>
								<tr>
									<td width="38" align="center">
										<a class="index-alert" style="cursor: not-allowed;">9</a>
									</td>
									<td align="left">
										<a class="index-alert" style="cursor: not-allowed;">Open Google</a>
									</td>
								</tr>
								<tr>
									<td width="38" align="center">
										<a class="index-alert" style="cursor: not-allowed;">10</a>
									</td>
									<td align="left">
										<a class="index-alert" style="cursor: not-allowed;">Open YouTube</a>
									</td>
								</tr>
								<tr>
									<td width="38" align="center">
										<a class="index-alert" style="cursor: not-allowed;">11</a>
									</td>
									<td align="left">
										<a class="index-alert" style="cursor: not-allowed;">My project page</a>
									</td>
								</tr>
								<tr>
									<td width="38" align="center">
										<a class="index-alert" style="cursor: not-allowed;">12</a>
									</td>
									<td align="left">
										<a class="index-alert" style="cursor: not-allowed;">Open Gemini</a>
									</td>
								</tr>
								<tr>
									<td width="38" align="center">
										<a class="index-alert" style="cursor: not-allowed;">13</a>
									</td>
									<td align="left">
										<a class="index-alert" style="cursor: not-allowed;">Open <b class="reverseIndexAlert"><i>Say any site name or specify any URL</i></b> </a>
									</td>
								</tr>
							</tbody>
						</table>
            		</div>
				</div>	
        	`);
          	return false;
    	}