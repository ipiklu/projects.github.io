// JavaScript Document for table display

const JSON_TABLE = [
    { 
		title: "bot bash script",
		content: `<table width="500" border="2" bordercolor="#AA205C">
		<thead> 
			<tr>
				<th class="zone-cell" colspan="3">BOT-BASH-SCRIPT</th>
			</tr>
			<tr>
				<th width="50">FOLDER</th>
				<th>LINK</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td width="38" title="Click-To-Open" onClick="window.open('data/bot.txt','bfs','fullscreen,scrollbars');">📂</td>
				<td title="Click-To-Open" onClick="window.open('data/bot.txt','bfs','fullscreen,scrollbars');">BotScript</td>
			</tr>
		</tbody>
		</table>`
	},
	{
        title: "goback",
        content: `<table width="500" border="2" bordercolor="#AA205C">
		<thead> 
			<tr>
                    	<td width="44"><img src="img/arrow.gif" width="38" height="38"></td>
                    	<td width="100" align="right">
                            <div class="marquee-container">
                                <span class="marquee-content">
                                    <span class="loader__dot index-alert">Click the </span>
                                    <span class="loader__dot index-alert" style="font-weight: bolder">Download button </span>
                                    <span class="loader__dot index-alert">to App Download</span>
                                </span>
                            </div>
                                 <div class="dropdown">
                                  <button onclick="appDownload()" class="dropbtn">
                                    <img src="img/android-icon.png" class="btn signup btnEffect" title="App Download" style="max-width:48px;">
                                  </button>
                                  <div id="myDropdown" class="dropdown-content">
                                  	<a href="data/PeeS_v2.0.apk" download title="Click to download android app">App Version 2.0 (LATEST)</a>
                                    <a href="data/PeeS.apk" download title="Click to download android app">App Version 1.0</a>
                                  </div>
                                </div>
                         </td>
                    </tr>
		</thead>
		<tbody>
			<tr>
				<td width="38">
					<a onClick="return(goBack());">
						<img src="img/back.gif" title="Click-To-Go-Back" class="btn signup btnEffect" style="max-width:27px";/>
					</a>
				</td>
				<td width="507" align="left">
					<a onClick="return(goBack());" title="Click-To-Go-Back" class="index-alert"> /.... </a>
				</td>
			</tr>
		</tbody>
		</table>`
    },
	{
        title: "server index",
        content: `<font color="#AA205C"><h2 align="center">Server Index:</h2></font>
		<table width="500" border="2" bordercolor="#AA205C">
		<thead> 
			<tr>
                    	<td width="44"><img src="img/arrow.gif" width="38" height="38"></td>
                    	<td width="100" align="right">
                            <div class="marquee-container">
                                <span class="marquee-content">
                                    <span class="loader__dot index-alert">Click the </span>
                                    <span class="loader__dot index-alert" style="font-weight: bolder">Download button </span>
                                    <span class="loader__dot index-alert">to App Download</span>
                                </span>
                            </div>
                                 <div class="dropdown">
                                  <button onclick="appDownload()" class="dropbtn">
                                    <img src="img/android-icon.png" class="btn signup btnEffect" title="App Download" style="max-width:48px;">
                                  </button>
                                  <div id="myDropdown" class="dropdown-content">
                                  	<a href="data/PeeS_v2.0.apk" download title="Click to download android app">App Version 2.0 (LATEST)</a>
                                    <a href="data/PeeS.apk" download title="Click to download android app">App Version 1.0</a>
                                  </div>
                                </div>
                         </td>
                    </tr>
		</thead>
		<tbody>
			<tr>
				<td width="38">
					<a onClick="return(goBack());">
						<img src="img/back.gif" title="Click-To-Go-Back" class="btn signup btnEffect" style="max-width:27px";/>
					</a>
				</td>
				<td width="507" align="left">
					<a onClick="return(goBack());" title="Click-To-Go-Back" class="index-alert"> /.... </a>
				</td>
			</tr>
					<tr>
                   		<td width="38">
							<a onClick="window.open('../../resume/index.html','bfs','fullscreen,scrollbars');" title="Links to resume pages">
								<img src="img/folder.png" class="btn signup btnEffect" style="max-width:27px"/>
							</a>
						</td>
                        <td width="507" align="left">
							<a onClick="window.open('../../resume/index.html','bfs','fullscreen,scrollbars');" title="Links to resume pages" class="index-alert"> Resume </a>
						</td>
                	</tr>
                	<tr>
                   		<td width="38">
							<a onClick="window.open('../../kaggle/index.html','bfs','fullscreen,scrollbars');" title="Links to Kaggle pages">
								<img src="img/folder.png" class="btn signup btnEffect" style="max-width:27px"/>
							</a>
						</td>
                        <td width="507" align="left">
							<a onClick="window.open('../../kaggle/index.html','bfs','fullscreen,scrollbars');" title="Links to Kaggle pages" class="index-alert"> Analytics Papers </a>
						</td>
                	</tr>
                    <tr>
                   		<td width="38">
							<a onClick="window.open('../../Login-v2.0/index.html','bfs','fullscreen,scrollbars');" title="Login_V2 page design">
								<img src="img/folder.png" class="btn signup btnEffect" style="max-width:27px"/>
							</a>
						</td>
                        <td width="507" align="left">
							<a onClick="window.open('../../Login-v2.0/index.html','bfs','fullscreen,scrollbars');" title="Login_V2 page design" class="index-alert" > Login-v2.0 </a>
						</td>
                	</tr>
                    <tr>
                   		<td width="38">
							<a onClick="window.open('../../dashboard-v2.0/index.html','bfs','fullscreen,scrollbars');" title="Dashboard-V2 page design">
								<img src="img/folder.png" class="btn signup btnEffect" style="max-width:27px"/>
							</a>
						</td>
                        <td width="507" align="left">
							<a onClick="window.open('../../dashboard-v2.0/index.html','bfs','fullscreen,scrollbars');" title="Dashboard-V2 page design" class="index-alert"> Dashboard-v2.0 </a>
						</td>
                	</tr>
                    <tr>
                   		<td width="38">
							<a onClick="window.open('../server/index.html','bfs','fullscreen,scrollbars');" title="Informative Project">
								<img src="img/folder.png" class="btn signup btnEffect" style="max-width:27px"/>
							</a>	
						</td>
                        <td width="507" align="left">
							<a onClick="window.open('../server/index.html','bfs','fullscreen,scrollbars');" title="Informative Project" class="index-alert"> Timepass </a>
						</td>
                	</tr>
                    <tr>
                   		<td width="38">
							<a onClick="window.open('../../notepad/index.html','bfs','fullscreen,scrollbars');" title="Editable Page">
								<img src="img/folder.png" class="btn signup btnEffect" style="max-width:27px"/>
							</a>
						</td>
                        <td width="507" align="left">
							<a onClick="window.open('../../notepad/index.html','bfs','fullscreen,scrollbars');" title="Editable Page" class="index-alert"> Notebook </a>
						</td>
                	</tr>
                    <tr>
                   		<td width="38">
							<a onClick="window.open('../../calculator/index.html','bfs','fullscreen,scrollbars');" title="Percentage Calculator">
								<img src="img/folder.png" class="btn signup btnEffect" style="max-width:27px"/>
							</a>
						</td>
                        <td width="507" align="left">
							<a onClick="window.open('../../calculator/index.html','bfs','fullscreen,scrollbars');" title="Percentage Calculator" class="index-alert"> Calculator </a>
						</td>
                	</tr>
		    		<tr>
                   		<td width="38">
							<a onClick="window.open('../../form/index.html','bfs','fullscreen,scrollbars');" title="FormToPDF">
								<img src="img/folder.png" class="btn signup btnEffect" style="max-width:27px"/>
							</a>
						</td>
                        <td width="507" align="left">
							<a onClick="window.open('../../form/index.html','bfs','fullscreen,scrollbars');" title="FormToPDF" class="index-alert"> FormToPDF </a>
						</td>
                	</tr>			
		</tbody>
		</table>`
    }
];