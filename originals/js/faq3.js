var curshow = 0;

function showmore(n,faqid)
{
	if (document.all)
	{
		if (curshow > 0)
		{
			document.all["faqa"+curshow].style.width='200px';
			document.all["faqa"+curshow].style.visibility='hidden';
			document.all["faqa"+curshow].style.position='absolute';
			document.all["faq"+curshow].style.position='relative';
			document.all["faq"+curshow].style.visibility='visible';
		}
		document.all["faq"+n].style.visibility='hidden';
		document.all["faq"+n].style.position='absolute';
		document.all["faqa"+n].style.position='relative';
		document.all["faqa"+n].style.visibility='visible';
		document.all["faqa"+n].style.width='auto';
		curshow = n;
	}	
	else
	{
		if (curshow > 0)
		{
			document.getElementById("faqa"+curshow).style.width='200px';
			document.getElementById("faqa"+curshow).style.visibility='hidden';
			document.getElementById("faqa"+curshow).style.position='absolute';
			document.getElementById("faq"+curshow).style.position='relative';
			document.getElementById("faq"+curshow).style.visibility='visible';
		}
		document.getElementById("faq"+n).style.visibility='hidden';
		document.getElementById("faq"+n).style.position='absolute';
		document.getElementById("faqa"+n).style.position='relative';
		document.getElementById("faqa"+n).style.visibility='visible';
		document.getElementById("faqa"+n).style.width='auto';
		curshow = n;
	}	

	AddVisitedFAQ(faqid);
	LogViewedFAQ(faqid);
}

function expandtt(num,id)
{
	document.getElementById("tooltip").innerHTML = tooltipdesc[num];
	document.getElementById("tooltip").style.visibility = 'visible';
	var obj = document.getElementById(id);
	if (!tooltipfix)
		document.getElementById("tooltip").style.left = (findPosX(obj) - 40) + 'px';
	else
		document.getElementById("tooltip").style.left = '10px';
	document.getElementById("tooltip").style.top = (findPosY(obj) + 26) + 'px';
}

function contracttt()
{
	document.getElementById("tooltip").style.visibility = 'hidden';
	document.getElementById("tooltip").innerHTML = '';
}

function findPosX(obj)
{
	var curleft = 0;
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curleft += obj.offsetLeft
			obj = obj.offsetParent;
		}
	}
	else if (obj.x)
		curleft += obj.x;
	return curleft;
}

function findPosY(obj)
{
	var curtop = 0;
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curtop += obj.offsetTop
			obj = obj.offsetParent;
		}
	}
	else if (obj.y)
		curtop += obj.y;
	return curtop;
}

function AddVisitedFAQ(id)
{
	c = document.cookie + ";";
	i = c.indexOf("X2FAQ");
	if (i >= 0)
	{
		j = c.indexOf(";", i);
		c = c.substr(i+6, j-i-6);
		i = c.indexOf("/" + id + "/");
		if (i >= 0) c = c.substr(0, i+1) + c.substr(i+id.length+2);
		j = 0;
		for (i=0 ; i < c.length ; i++) if (c[i] == '/') j++;
		if (j >= 6)
		{
			i = c.indexOf("/", 1);
			c = c.substr(i);
		}
	}
	else
		c = "/";
		
	c += id + "/";

	document.cookie = "X2FAQ=" + c + "; path=/;";
}

function UsefulFAQ(id, code)
{
	var ans = "";
	if (document.getElementById("rad" + id + "a").checked == true) ans = "1";
	if (document.getElementById("rad" + id + "b").checked == true) ans = "2";
	if (document.getElementById("rad" + id + "c").checked == true) ans = "3";
	if (document.getElementById("rad" + id + "d").checked == true) ans = "4";
	document.getElementById("faqspan" + id).innerHTML = 'Thank you!';
	var img = new Image();
	img.src = p14url + "F01" + code + "+" + faqarea + "_" + ans + (new Date()).getTime() + "_";
}

function LogViewedFAQ(code)
{
	var img = new Image();
	img.src = p14url + "F02" + code + "+" + faqarea + "_" + (new Date()).getTime();
}