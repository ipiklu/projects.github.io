// JavaScript Document

function ValidateEmail() {
         var x = document.getElementById("txtEmail").value;
         var atpos = x.indexOf("@");
         var dotpos = x.lastIndexOf(".");
         if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {


             document.getElementById("lblError").innerHTML = "Invalid email address";
			 return true;
         }
         else {
             document.getElementById("lblSuccess").innerHTML = "✔SUCCESS";
			 return false;
         }
     }

 <!---POPUP Coustomization---> 
	  function view() {
          alertify.alert("<a href='https://www.linkedin.com/in/sayantan-kundu-52650758'><img src='img/linkedin.png' style='max-width: 90%; max-height: 70%'/></a><br/><a href='https://twitter.com/piklu21'><img src='img/twitter.png' style='max-width: 30%; max-height: 30%'/></a><a href='https://www.facebook.com/kundupiklu'><img src='img/facebook.jpg' style='max-width: 30%; max-height: 30%'/> </a><a href='https://www.instagram.com/i_piklu/'><img src='img/instagram.png' style='max-width: 30%; max-height: 30%'/></a><p style='color:#AA205C; font-style:italic; font-weight:bolder; font-size:25px' />STAY HOME, STAY SAFE.</p><p style='color:#AA205C; font-style:italic; font-weight:bolder; font-size:25px' />#Covid-19 #HomeQuarantine</p>");
          return false;
    } 
