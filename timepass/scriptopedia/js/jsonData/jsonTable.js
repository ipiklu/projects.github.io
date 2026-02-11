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
				<th title="\u{1F447}Press below links to open\u{1F447}" width="50">FOLDER</th>
				<th title="\u{1F447}Press below links to open\u{1F447}">LINK</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td width="38">
					<a title="Click-To-Open" onClick="window.open('data/bot.txt','_blank','fullscreen,scrollbars');" class="index-alert">\u{1F4C4}</a>
				</td>
				<td>
					<a title="Click-To-Open" onClick="window.open('data/bot.txt','_blank','fullscreen,scrollbars');" class="index-alert">BotScript</a>
				</td>
			</tr>
		</tbody>
		</table>`
	},
	{ 
		title: "msoffice links",
		content: `<table width="500" border="2" bordercolor="#AA205C">
		<thead> 
			<tr>
				<th class="zone-cell" colspan="3">
					<img src="img/Office.webp" title="Click-Below-To-Open-Application" style="max-width:200px;">
				</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>
					<a onClick="openExcel()" class="index-alert">
						<img src="img/excel.webp" title="Click-To-Open-Application" style="max-width: 70px;">
					</a>
				</td>
				<td>
					<a onClick="openWord()" class="index-alert">
						<img src="img/word.webp" title="Click-To-Open-Application" style="max-width: 70px;">
					</a>
				</td>
				<td>
					<a onClick="openPowerPoint()" class="index-alert">
						<img src="img/pptx.png" title="Click-To-Open-Application" style="max-width: 70px;">
					</a>
				</td>
			</tr>
		</tbody>
		</table>`
	},
	{ 
		title: "help",
		content: `<table width="700" border="2" bordercolor="#AA205C">
		<thead> 
			<tr>
				<th class="zone-cell" colspan="3">
					<a title="Click-To-View" onClick="window.open('data/help.pdf','_blank','fullscreen,scrollbars');" class="index-alert">HELP-FOR-SEARCH</a>
				</th>
			</tr>
			<tr>
				<th width="60" style="cursor: not-allowed;">SR</th>
				<th width="300" style="cursor: not-allowed;">Topics</th>
				<th width="300" style="cursor: not-allowed;">Search-Keywords</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>
					<a class="index-alert">1</a>
				</td>
				<td align="left">
					<a class="index-alert">How to search for any full forms</a>
				</td>
				<td align="left" style="padding: 2px">
					<a class="index-alert">Type the <i style="color: rgba(170, 32, 92, 0.5);">keyword <b>full form</b></i>
						<br><br>
						<b><u>Example:</u></b>
						<br>
						<i style="color: rgba(170, 32, 92, 0.5);">HTML <b>full form</b></i>
					</a>
				</td>
			</tr>
			<tr>
				<td>
					<a class="index-alert">2</a>
				</td>
				<td align="left">
					<a class="index-alert">How to display homepage index</a>
				</td>
				<td align="left" style="padding: 2px">
					<a class="index-alert">Type <i><b style="color: rgba(170, 32, 92, 0.5);">index</b></i>	
					</a>
				</td>
			</tr>
			<tr>
				<td>
					<a class="index-alert">3</a>
				</td>
				<td align="left">
					<a class="index-alert">How to display any external web-links</a>
				</td>
				<td align="left" style="padding: 2px">
					<a class="index-alert">Type <i><b style="color: rgba(170, 32, 92, 0.5);">web links</b></i>
					</a>
				</td>
			</tr>
			<tr>
				<td>
					<a class="index-alert">4</a>
				</td>
				<td align="left">
					<a class="index-alert">How to navigate to previous page</a>
				</td>
				<td align="left" style="padding: 2px" onClick="popup_tableView()";>
					<a class="index-alert">Type <i><b style="color: rgba(170, 32, 92, 0.5);">back</b></i>
					</a>
				</td>
			</tr>
		</tbody>
		</table>`
	},
	{ 
		title: "web links",
		content: `<table width="220" border="2" bordercolor="#AA205C">
		<thead> 
			<tr>
				<th class="zone-cell" title="\u{1F447}Press below links to open\u{1F447}" colspan="2">WEB-LINKS</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td width="38">
					<a title="Click-To-Open-Google-Search" onClick="window.open('https://www.google.com','_blank','fullscreen,scrollbars');" class="index-alert">\u{1F310}</a>
				</td>
				<td align="left">
					<a title="Click-To-Open-Google-Search" onClick="window.open('https://www.google.com','_blank','fullscreen,scrollbars');" class="index-alert">Google Search</a>
				</td>
			</tr>
			<tr>
				<td width="38">
					<a title="Click-To-Open-Google-Maps" onClick="window.open('https://google.com/maps','_blank','fullscreen,scrollbars');" class="index-alert">\u{1F5FA}</a>
				</td>
				<td align="left">
					<a title="Click-To-Open-Google-Maps" onClick="window.open('https://google.com/maps','_blank','fullscreen,scrollbars');" class="index-alert">Google Maps</a>
				</td>
			</tr>
			<tr>
				<td width="38">
					<a title="Click-To-Open-Google-Gemini" onClick="window.open('https://gemini.google.com/','_blank','fullscreen,scrollbars');" class="index-alert">\u{1F916}</a>
				</td>
				<td align="left">
					<a title="Click-To-Open-Google-Maps" onClick="window.open('https://gemini.google.com/','_blank','fullscreen,scrollbars');" class="index-alert">Google Gemini</a>
				</td>
			</tr>
			<tr>
				<td width="38">
					<a title="Click-To-Open-Meditate" onClick="window.open('../meditate/index.html','_blank','fullscreen,scrollbars');" class="index-alert">\u{1F9D8}</a>
				</td>
				<td align="left">
					<a title="Click-To-Open-Meditate" onClick="window.open('../meditate/index.html','_blank','fullscreen,scrollbars');" class="index-alert">Meditate</a>
				</td>
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


<!---POPUP Table view--(backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);)-> 
function popup_tableView() {
    alertify.alert(`
        <table width="500" border="2" bordercolor="#AA205C" style="backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);">
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
		</table>
    `);
    return false;
}