// JavaScript Document

function openEditableTab() {

	const iconUrl = 'https://ipiklu.github.io/projects.github.io/img/s.gif'; 
	const cssUrl = 'https://ipiklu.github.io/projects.github.io/notepad/css/design.css';
	
	  // 1. Define the HTML content
	  const htmlContent = `<html contenteditable class="animated-sparkle" data-placeholder="Click-To-Type" style="padding-top:10px;padding-left:10px;font-family:'Indie Foower',cursive;">
	  		<title>Web-Note</title>
			<link rel="icon" href="${iconUrl}" type="image/gif">
			<link rel="stylesheet" href="${cssUrl}" /></html>`;
	  
	  // 2. Create a Blob (Binary Large Object)
	  const blob = new Blob([htmlContent], { type: 'text/html' });
	  
	  // 3. Create a temporary URL for the Blob
	  const blobUrl = URL.createObjectURL(blob);
	  
	  // 4. Open the new window/tab using the Blob URL
	  window.open(blobUrl, '_blank');
	  
	  // Clean up the URL once the window is open (optional, but good practice)
	  // URL.revokeObjectURL(blobUrl); 
}

 <!---POPUP Coustomization---> 
	  function view() {
          alertify.alert("<a href='https://www.linkedin.com/in/sayantan-kundu-52650758' target='_blank'><img src='img/linkedin.png' style='max-width: 90%; max-height: 70%'/></a><br/><a href='https://twitter.com/piklu21' target='_blank'><img src='img/twitter.png' style='max-width: 30%; max-height: 30%'/></a><a href='https://www.facebook.com/kundupiklu' target='_blank'><img src='img/facebook.jpg' style='max-width: 30%; max-height: 30%'/> </a><a href='https://www.instagram.com/i_piklu/' target='_blank'><img src='img/instagram.png' style='max-width: 30%; max-height: 30%'/></a><p class='index' style='font-style:italic; font-weight:bolder; font-size:25px' />STAY HOME, STAY SAFE.</p><p class='index' style='font-style:italic; font-weight:bolder; font-size:25px' />#Covid-19 #HomeQuarantine</p>");
          return false;
    }