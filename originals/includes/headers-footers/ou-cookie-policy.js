var oudomain = window.location.hostname;
var idx = oudomain.indexOf(".");
var mdomain = oudomain.slice(idx,oudomain.length);	

function ougetCookie(c_name) {
    
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
    ousetCookie("ou_cookie_policy", "notified", 365, mdomain);
}

function displayNotification(c_action) {
		
		var message = "<div class='cookieBanner'>";
		message = message + "<div class='cookieBannerWrap'>";
		message = message + "<p>";
		message = message + "We use cookies to make sure our websites work effectively and to improve your user experience.  If you continue to use this site we will assume that you are happy with this. However, you can change your cookie settings at any time.";
		message = message + "</p>";
		message = message + "<ul>";
		message = message + "<li>";
		message = message + "<a href='http://www.open.ac.uk/about/main/admin-and-governance/policies-and-statements/cookie-use-the-ou-website'>More Info/Change Settings</a>";
		message = message + "</li>";
		message = message + "<li>";
		message = message + "<a class='continue' href='#' onclick='JavaScript:oudoAccept();'>Continue</a>";
		message = message + "</li>";
		message = message + "</ul>";
		message = message + "</div>";
		message = message + "</div>";

    document.writeln(message);
}

function oudoAccept() {
    ousetCookie("ou_cookie_policy", "continue", 365, mdomain);
    location.reload(true);
}


function ousetCookie(c_name, value, exdays, domain) {

    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString() + "; path=/");
    document.cookie = c_name + "=" + c_value + ";domain=" + domain;
}

function oucheckCookie(c_action) {
    var cookieName = "ou_cookie_policy";
    var cookieChk = ougetCookie(cookieName);
    var cookieSAMS = "SAMSsession";
    var cookie2SAMS = "SAMS2session";
    var samsCookie1 = ougetCookie(cookieSAMS);
    var samsCookie2 = ougetCookie(cookie2SAMS);
    
    if(samsCookie1 != null && samsCookie1 != ""){
    	
	    //if (cookieChk != null && cookieChk != "continue") {
	        ousetCookie("ou_cookie_policy", "continue", 365, mdomain); // set the cookie to expire in a year.
	    //}
  }
  else {
	    if (cookieChk != null && cookieChk != "notified") {
	        ousetCookie(cookieName, cookieChk, 365, mdomain); // set the cookie to expire in a year.
	    }
	    else{
	        displayNotification(c_action);	        
	      }
	    }
}

// blockOrCarryOn - 
//					1 = Carry on, store a do not store cookies cookie and carry on
//					0 = Block/redirect
var blockOrCarryOn = 1;
oucheckCookie(blockOrCarryOn);
