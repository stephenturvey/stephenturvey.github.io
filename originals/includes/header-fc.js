var ouinitdone=false;

function ou_init()
{
	if (ouinitdone) return;
	ouinitdone=true;
	ou_linksline();
}

function ou_linksline()
{
	if (navigator.appName == "Netscape" && parseFloat(navigator.appVersion) < 5) return;
	ele = document.getElementById("ou-row2");
	if (ele == null) ele = document.getElementById("ou-row3b");
	if (ele == null) return;
	ele = ou_links_createul(ele);
	sb_c = document.cookie + ";";
	sb_p = sb_c.indexOf("SAMSsession");
	sb_h = 0;
	if (sb_p >= 0)
	{
		for (i=sb_p+12 ; ; i++ ) 
		{
			if (sb_c.substr(i, 1) == ';') break;
			sb_h += sb_c.charCodeAt(i);
		}
		sb_p = sb_c.indexOf("%2E", sb_p);
	}
	sb_id = "";
	sb_pi = "";
	if (sb_p >= 0)
	{
		username = "";
		sb_p2 = sb_c.indexOf("HS7BDF=");
		if (sb_p2 >= 0)
		{
			sb_p3 = sb_c.indexOf(";", sb_p2);
			sb_p4 = sb_c.indexOf("\\", sb_p2);
			if (sb_p4 > 0 && sb_p4 < sb_p3)
			{
				if (parseFloat(sb_c.substr(sb_p4+1)) != sb_h) sb_p2 = -1;
				sb_p3 = sb_p4;
			}
			if (sb_p2 >= 0)
			{
				sb_nm = sb_c.substr(sb_p2+7,sb_p3-sb_p2-7);
				sb_nm2 = "";
				for (i=0 ; i < sb_nm.length ; i++)
				{
					j = sb_nm.charCodeAt(i) % 256;
					if (j >= 192 && j <= 223 && i < sb_nm.length-1)
					{
						k = sb_nm.charCodeAt(i+1) % 256;
						sb_nm2 += String.fromCharCode((j-192)*64 + (k-128));
						i++;
					}
					else
						sb_nm2 += String.fromCharCode(j);
				}
				username += sb_nm2 + " ";
			}
		}
		sb_p2 = sb_c.indexOf("%2E", sb_p+3);
		if (sb_p2 - sb_p == 11)
		{
			sb_pi = sb_c.substr(sb_p+3,8);
			ou_links_addnodeinli(ele, document.createTextNode(username + "(" + sb_pi + ")"));
			ou_links_addlink(ele, "ou-studenthome", "https://msds.open.ac.uk/students/", "StudentHome");
		}
		else
		{
			sb_id = "";
			sb_p = sb_c.indexOf("%2E", sb_p2+3);
			if (sb_p - sb_p2 == 11) 
				sb_id = sb_c.substr(sb_p2+3,8);
			else
			{
				sb_p2 = sb_c.indexOf("%2E", sb_p+3);
				if (sb_p2 - sb_p == 11)
					sb_id = sb_c.substr(sb_p+3,8);
				else
				{
					sb_p = sb_c.indexOf("%2E", sb_p2+3);
					if (sb_p - sb_p2 == 11) sb_id = sb_c.substr(sb_p2+3,8);
				}
			}
			ou_links_addnodeinli(ele, document.createTextNode(username + "(" + sb_id + ")"));
			ou_links_addlink(ele, "ou-studenthome", "https://msds.open.ac.uk/students/", "StudentHome");
			ou_links_addlink(ele, "ou-tutorhome", "https://msds.open.ac.uk/tutorhome/", "TutorHome");
			ou_links_addlink(ele, "ou-intranethome", "http://intranet.open.ac.uk/", "IntranetHome");
			if (document.cookie.indexOf("P14MENU=Y") < 0) document.getElementById("ioemenu").style.display='none';
		}
		ou_links_addlink(ele, "ou-signout", "https://msds.open.ac.uk/signon/samsoff.aspx", "Sign out");
	}
	else
	{
		ou_links_addlink(ele, "ou-signin", "https://msds.open.ac.uk/signon/sams001.aspx?nsh=1&amp;url=" + document.location.href, "Sign in");
	}
}

function ou_links_createul(ele)
{
	var e_ul = document.createElement("ul");
	ele.appendChild(e_ul);
	return e_ul;
}

function ou_links_addlink(e_ul, id, url, text)
{
	var e_a = document.createElement("a");
	e_a.setAttribute("id", id);
	e_a.setAttribute("href", url);
	e_a.setAttribute("target", "_top");
	e_a.appendChild(document.createTextNode(text));
	ou_links_addnodeinli(e_ul, e_a);
}

function ou_links_addnodeinli(e_ul, n_inner)
{
	var e_li = document.createElement("li");
	e_li.appendChild(n_inner);
	e_ul.appendChild(e_li);
}
