// (c) 2007-2008 The Open University
// Written by Steve Bannister
// www.open.ac.uk

var ioemenus = false;
var ioeul=[null,null];
var ioestatus=[0,0];
var ioetimer = null;
var ioefadetime = null;

function ioe_createmenus()
{
	if (!document.getElementById) return;
	e_div = document.getElementById("ioemenu2");
	if (e_div == null) return;
		
	path = "https://msds.open.ac.uk/students/";
	if (document.cookie.indexOf("P14MENU=Y") >= 0) path = "http://csintra1.open.ac.uk/students/";
	if (window.ioe_rel !== undefined)
	{
		if (ioe_rel == 1) path = "";
		if (ioe_rel == 2) path = "https://msds-acct.open.ac.uk/students/";
	}
		
	if (ioe_numcrse > 0)
	{
		ioeul[0] = document.createElement("ul");
		lft = 242;
		if (ioe_crsewidth > 43) lft -= (ioe_crsewidth - 43) * 16;
		ioeul[0].style.cssText = "width:" + ioe_crsewidth + "em;left:" + lft + "px;";
		e_div.appendChild(ioeul[0]);
		
		for (i=0 ; i < ioe_numcrse ; i++)
		{
			ioe_addmenuitem(ioeul[0], ioe_course[i], " " + ioe_crsetitle[i] + " (" + ioe_pres[i].substr(0,4) + ")", path + "course.aspx?c=" + ioe_course[i] + "_" + ioe_pres[i], ioe_crsetype[i]);
		}
		
		if (ioe_crsemore) ioe_addmenuitem(ioeul[0], null, "See all your courses \u203a", path + "courselist.aspx", 4);
		ioe_addmenuitem(ioeul[0], "Choose your next course \u203a", "", path + "next.aspx", 1);
	}

	if (ioe_numqual > 0)
	{
		ioeul[1] = document.createElement("ul");
		lft = 353;
		if (ioe_qualwidth > 43) lft -= (ioe_qualwidth - 36) * 16;
		ioeul[1].style.cssText = "width:" + ioe_qualwidth + "em;left:" + lft + "px;";
		e_div.appendChild(ioeul[1]);
		
		for (i=0 ; i < ioe_numqual ; i++)
		{
			if (ioe_qualocc[i].length == 1)
				ioe_addmenuitem(ioeul[1], null, ioe_qualtitle[i], path + "research.aspx?t=" + ioe_qualocc[i], 0);
			else
				ioe_addmenuitem(ioeul[1], null, ioe_qualtitle[i], path + "qual.aspx?q=" + ioe_qualocc[i], 0);
		}
		if (ioe_qualmore) ioe_addmenuitem(ioeul[1], null, "See all your qualifications \u203a", path + "quallist.aspx", 4);
	}

	for (i=0 ; i < 2 ; i++)
	{
		if (ioeul[i] == null) continue;
		if (window.attachEvent)
		{
			ioeul[i].attachEvent("onmouseover", ioe_keepalive);
			ioeul[i].attachEvent("onmouseout", ioe_hidemenu);
		}
		if (window.addEventListener)
		{
			ioeul[i].addEventListener("mouseover", ioe_keepalive, false);
			ioeul[i].addEventListener("mouseout", ioe_hidemenu, false);
		}
	}

	ioemenus = true;
}

function ioe_addmenuitem(e_ul, cc, t, u, x)
{
	var e_a = document.createElement("a");
	e_a.setAttribute("href", u);
	
	if (cc)
	{
		if (x == 1 && cc)
		{
			var e_s = document.createElement("strong");
			e_s.appendChild(document.createTextNode(cc));
			e_a.appendChild(e_s);
		}
		else
			e_a.appendChild(document.createTextNode(cc));
	}
	
	e_a.appendChild(document.createTextNode(t));
	if (x == 1 || x == 4) e_a.className = "active";
	if (x == 3) e_a.className = "cancel";
	
	if (window.attachEvent)
		e_a.attachEvent("onclick", ioe_hidemenu);
	if (window.addEventListener)
		e_a.addEventListener("click", ioe_hidemenu, false);

	var e_li = document.createElement("li");
	e_li.appendChild(e_a);
	e_ul.appendChild(e_li);
}

function ioe_showmenu(mm)
{
	if (!ioemenus) return;
	
	n = -1;
	if (mm == 3) n = 0;
	if (mm == 4) n = 1;
	
	for (i=0 ; i < 2 ; i++)
	{
		if (ioeul[i] == null) continue;
		if (i != n)
		{	// fade out
			if (ioestatus[i] == 1)
			
			 { ioestatus[i] = 201; ioefadetime = new Date(); }
			if (ioestatus[i] == 101) { ioestatus[i] = 0; ioefadetime = 0; }
			if (ioestatus[i] == 102) { ioestatus[i] = 203; ioefadetime = 0; }
			if (ioestatus[i] == 103) { ioestatus[i] = 202; ioefadetime = 0; }
			if (ioestatus[i] > 300) ioestatus[i] = 201;
		}
		else
		{	// fade in
			if (ioestatus[i] == 0) { ioestatus[i] = 101; ioefadetime = new Date(); }
			if (ioestatus[i] == 201) { ioestatus[i] = 1; ioefadetime = 0; }
			if (ioestatus[i] == 202) { ioestatus[i] = 103; ioefadetime = 0; }
			if (ioestatus[i] == 203 || ioestatus[i] == 204) { ioestatus[i] = 102; ioefadetime = 0; }
			if (ioestatus[i] > 300) ioestatus[i] = 1;
		}
	}
	
	ioe_process();
		
	if (!ioetimer) ioetimer = window.setInterval('ioe_process()', 30);
}

function ioe_hidemenu()
{
	if (!ioemenus) return;
	
	for (i=0 ; i < 2 ; i++)
	{
		if (ioestatus[i] == 1) ioestatus[i] = 301;
		if (ioestatus[i] == 101) ioestatus[i] = 0;
		if (ioestatus[i] == 102) ioestatus[i] = 203;
		if (ioestatus[i] == 103) ioestatus[i] = 202;
	}
	
	ioe_process();
}

function ioe_keepalive()
{
	if (!ioemenus) return;
	
	for (i=0 ; i < 2 ; i++)
	{
		if (ioestatus[i] > 300) ioestatus[i] = 1;
	}
}

function ioe_process()
{
	var endnow = false;
	
	if (ioefadetime > 0) 
	{
		dur = new Date() - ioefadetime;
		if (dur > 150) endnow = true;
	}
	
	for (i=0 ; i < 2 ; i++)
	{
		if (endnow == true && ioestatus[i] > 100 && ioestatus[i] < 110) ioestatus[i] = 103;
		if (endnow == true && ioestatus[i] > 200 && ioestatus[i] < 210) ioestatus[i] = 204;
		
		if (ioestatus[i] == 101)
		{
			ioeul[i].style.visibility = 'visible';
			ioeul[i].style.opacity = '0.33';
			ioeul[i].style.filter='alpha(opacity=33)';
			ioestatus[i] = 102;
			continue;
		}
		if (ioestatus[i] == 102)
		{
			ioeul[i].style.opacity = '0.67';
			ioeul[i].style.filter='alpha(opacity=67)';
			ioestatus[i] = 103;
			continue;
		}
		if (ioestatus[i] == 103)
		{
			ioeul[i].style.opacity = '1.0';
			ioeul[i].style.filter='alpha(opacity=100)';
			ioestatus[i] = 1;
			ioefadetime = 0;
			continue;
		}
		if (ioestatus[i] == 201)
		{
			ioeul[i].style.opacity = '0.75';
			ioeul[i].style.filter='alpha(opacity=75)';
			ioestatus[i] = 202;
			continue;
		}
		if (ioestatus[i] == 202)
		{
			ioeul[i].style.opacity = '0.50';
			ioeul[i].style.filter='alpha(opacity=50)';
			ioestatus[i] = 203;
			continue;
		}
		if (ioestatus[i] == 203)
		{
			ioeul[i].style.opacity = '0.25';
			ioeul[i].style.filter='alpha(opacity=25)';
			ioestatus[i] = 204;
			continue;
		}
		if (ioestatus[i] == 204)
		{
			ioeul[i].style.visibility = 'hidden';
			ioestatus[i] = 0;
			ioefadetime = 0;
			continue;
		}
		if (ioestatus[i] > 300)
		{
			ioestatus[i]++;
			if (ioestatus[i] == 315) { ioestatus[i] = 201; ioefadetime = new Date(); }
			continue;
		}
	}
	
	var active = false;
	
	for (i=0 ; i < 2 ; i++)
	{
		if (ioestatus[i] != 0) active = true;
	}
	
	if (active == false)
	{
		if (ioetimer) window.clearInterval(ioetimer);
		ioetimer = null;
	}
}
