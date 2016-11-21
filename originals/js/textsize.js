function initfont()
{
	e = document.getElementById("tssel");
	if (e == null) return;
	e.style.visibility='visible';
	s = document.cookie + ";";
	i = s.indexOf("P14TS");
	if (i < 0) return;
	j = s.indexOf(";", i);
	if (j < 0) return;
	n = parseFloat(s.substr(i+6, j-i-6));
	if (n < 2 || n > 4) return;
	changefont(n);
}

function changefont(n)
{
	e = document.getElementById("tscontent");
	if (e == null) return;
	document.cookie = "P14TS=" + n + "; expires=Sun, 01 Dec 2030 23:59:59 GMT; path=/; domain=open.ac.uk;";
	if (n == 1) document.getElementById("ts1").style.borderColor='#fc0'; else document.getElementById("ts1").style.borderColor='#ccc';
	if (n == 2) document.getElementById("ts2").style.borderColor='#fc0'; else document.getElementById("ts2").style.borderColor='#ccc';
	if (n == 3) document.getElementById("ts3").style.borderColor='#fc0'; else document.getElementById("ts3").style.borderColor='#ccc';
	if (n == 4) document.getElementById("ts4").style.borderColor='#fc0'; else document.getElementById("ts4").style.borderColor='#ccc';
	n = 0.9 + n * 0.1;
	e.style.fontSize = n + "em";
}