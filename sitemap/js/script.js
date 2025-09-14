// JavaScript Document

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
            <p style="color:#AA205C; font-style:italic; font-weight:bolder; font-size:25px;">STAY HOME, STAY SAFE.</p>
            <p style="color:#AA205C; font-style:italic; font-weight:bolder; font-size:25px;">#Covid-19 #HomeQuarantine</p>
        `);
          return false;
    }
	
	function policy() {
          alertify.alert(`
            <div style="display:flex; justify-content:center; margin-bottom: 10px; background:rgba(255, 255, 100, 0.7); color:#AA205C;">
                <p>Privacy Policy
				    Information We Collect:
				    We may collect personal information from you in a variety of ways, including, but not limited to, when you visit our site, fill out a form, and in connection with other activities, services, features, or resources we make available on our site. The types of personal information we may collect include:
					Contact Information: Name, email address, phone number, and mailing address.
				    Usage Data: Information about how you access and use our site, such as your IP address, browser type, operating system, and pages you visit.
				    Cookies and Tracking Technologies: We use cookies and similar tracking technologies to track the activity on our site and store certain information.
				</p>
			</div>
		`);
          return false;
    }
	
function reloadClear() {
    window.localStorage.clear();
    window.location.reload(true);
    return false;
}