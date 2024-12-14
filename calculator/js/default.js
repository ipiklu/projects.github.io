// JavaScript Document

function percentage_1() {

	// Method returns the element of percent id
	var percent = document.getElementById("percent").value;
	
	// Method returns the element of num id
	var num = document.getElementById("num").value;
	document.getElementById("value1")
		.value = (num / 100) * percent;
}

function percentage_2() {

	// Method returns the element of num1 id
	var num1 = document.getElementById("num1").value;
	
	// Method returns the elements of num2 id
	var num2 = document.getElementById("num2").value;
	document.getElementById("value2")
			.value = (num1 * 100) / num2 + "%";
}

function reloadClear() {
  window.localStorage.clear();
  window.location.reload(true);
  return false;
}

 <!---POPUP Coustomization---> 
	  function view() {
          alertify.alert("<a href='https://www.linkedin.com/in/sayantan-kundu-52650758' target='_blank'><img src='img/linkedin.png' style='max-width: 90%; max-height: 70%'/></a><br/><a href='https://twitter.com/piklu21' target='_blank'><img src='img/twitter.png' style='max-width: 30%; max-height: 30%'/></a><a href='https://www.facebook.com/kundupiklu' target='_blank'><img src='img/facebook.jpg' style='max-width: 30%; max-height: 30%'/> </a><a href='https://www.instagram.com/i_piklu/' target='_blank'><img src='img/instagram.png' style='max-width: 30%; max-height: 30%'/></a><p style='color:#AA205C; font-style:italic; font-weight:bolder; font-size:25px' />STAY HOME, STAY SAFE.</p><p style='color:#AA205C; font-style:italic; font-weight:bolder; font-size:25px' />#Covid-19 #HomeQuarantine</p>");
          return false;
    }