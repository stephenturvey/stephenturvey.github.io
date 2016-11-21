var smc_usertype = 1;		  		  // Enquirer
var smc_student_pricing_area = "";	  // Student's actual pricing area. This is read/set by web page


smc_init();

function smc_error(n)
{
/*
    1.  quallist dropdown element missing
    2.  Exception in smc_changequal2()
    3.  Exception in smc_fillpaths2()
    4.  pathlist dropdown element missing
    5.  smc_path_codes or smc_path_titles arrays missing
    6.  smc_path_codes or smc_path_titles arrays too small
    7.  smc_path_codes/smc_path_titles length zero or mismatch
    8.  Exception in smc_fill_pricingareas2()
    9.  pricearea dropdown element missing
    10. user1 radio button element missing
    11. updbtn element missing
    12. studpi element missing
    13. user2 radio button element missing
    14. X2SMC cookie contains incorrect number of parts
    15. Exception in function smc_rehydrate2()
    16. Qual code not found during rehydration
    17. Path code not found during rehydration
    18. User type incorrect during rehydration
    19. Pricing area not found during rehydration

*/
	
	switch (n)
	{
        default: alert("Sorry, there's a problem with the page. Please try refreshing.\r\n\r\n" + "Support error " + n);
                 break;
	}
}

function smc_init()
{
    var ql = document.getElementById("quallist");
	if (!ql) return smc_error(1);
    ql.selectedIndex = 0;
    
	var pl = document.getElementById("pathlist");
	if (!pl) return smc_error(4);
	pl.disabled="disabled";
	
	var pi = document.getElementById("studpi");
	if (!pi) return smc_error(12);
	pi.value = "";
	
    var u1 = document.getElementById("user1");
	if (!u1) return smc_error(10);
	u1.checked = true;
	smc_usertype = 1;

	smc_fill_pricingareas();
	
	smc_rehydrate();
	
	smc_update_button();
}

function smc_changequal()
{
	try
	{
		smc_changequal2();
	}
	catch(err)
	{
		smc_error(2);
	}
}

function smc_changequal2()
{
	var ql = document.getElementById("quallist");
	if (!ql) return smc_error(1);
	
	var ndx = ql.selectedIndex;
	
	if (!smc_fillpaths(ndx)) return;
	
	smc_update_button();
}

function smc_fillpaths(ndx)
{
	var ok = false;
	
	try
	{
		ok = smc_fillpaths2(ndx);
	}
	catch(err)
	{
		smc_error(3);
	}
	
	return ok;
}

function smc_fillpaths2(ndx)
{
	var pl = document.getElementById("pathlist");
	if (!pl)
	{
		smc_error(4);
		return false;
	}
	
	smc_remove_children(pl);
	
	if (ndx == 0) 
	{
		pl.disabled="disabled";
		return true;
	}
	
	if (typeof window.smc_path_codes == 'undefined' || typeof window.smc_path_titles == 'undefined')
	{
		smc_error(5);
		return false;
	}
	
	ndx--;
	
	if (typeof window.smc_path_codes[ndx] == 'undefined' || typeof window.smc_path_titles[ndx] == 'undefined')
	{
		smc_error(6);
		return false;
	}
	
	var len = smc_path_codes[ndx].length;
	
	if (len == 0 || len != smc_path_titles[ndx].length)
	{
		smc_error(7);
		return false;
	}
	
	if (len > 1) smc_add_select_option(pl, "0", "Choose a pathway...");
	
	for (var i=0 ; i < len ; i++)
	{
		smc_add_select_option(pl, smc_path_codes[ndx][i], smc_path_titles[ndx][i] + " (" + smc_path_codes[ndx][i].replace("_", " ").replace("_", " ") + ")");
	}
	
	pl.disabled="";
	
	return true;
}

function smc_add_select_option(id, v, t)
{
    var ele = document.createElement("option");
    
	ele.appendChild(document.createTextNode(t));
 	ele.setAttribute("value", v);
   
	id.appendChild(ele);
}

function smc_fill_pricingareas()
{
	try
	{
		smc_fill_pricingareas2();
	}
	catch(err)
	{
		smc_error(8);
	}
}

function smc_fill_pricingareas2()
{
    var pa = document.getElementById("pricearea");
	if (!pa) return smc_error(9);
	
	smc_remove_children(pa);
	
	if (smc_usertype == 1) 
		smc_add_select_option(pa, "0", "Choose a pricing area...");
	else
		smc_add_select_option(pa, "0", "Use default for student");
		
    smc_add_select_option(pa, "EN", "England");
    smc_add_select_option(pa, "SC", "Scotland");
    smc_add_select_option(pa, "WA", "Wales");
    smc_add_select_option(pa, "NI", "Northern Ireland");
    smc_add_select_option(pa, "IE", "Republic of Ireland");
    smc_add_select_option(pa, "EU", "European Union");
    smc_add_select_option(pa, "OE", "Other overseas");
    smc_add_select_option(pa, "ET", "England (transitional)");
    smc_add_select_option(pa, "IT", "Northern Ireland (transitional)");
    smc_add_select_option(pa, "UT", "European Union (transitional)");
    smc_add_select_option(pa, "OT", "Other overseas (transitional)");
}

function smc_changepath()
{
	smc_update_button();
}

function smc_update_button()
{
	var ub = document.getElementById("updbtn");
	if (!ub) return smc_error(11);
	
	var pl = document.getElementById("pathlist");
	if (!pl) return smc_error(4);
	
	var v = "0";
	if (pl.selectedIndex >= 0) v = pl.options[pl.selectedIndex].value;
	
	// For enquirer, make sure a pricing area has been set
	// For student, make sure PI looks valid
	if (smc_usertype == 1)
	{
    	var pa = document.getElementById("pricearea");
		if (!pa) return smc_error(9);
		if (pa.selectedIndex == 0) v = "0";
	}
	else
	{
		if (!smc_is_pi_okay()) v = "0";
	}
	
	if (v == "0")
	{
		ub.disabled = "disabled";
		return;
	}
		
	ub.disabled = "";
}

function smc_changeusertype()
{
    var u1 = document.getElementById("user1");
	if (!u1) return smc_error(10);
	
	if (u1.checked)
		smc_usertype = 1;
	else
		smc_usertype = 2;
		
	smc_fill_pricingareas();
	smc_update_button();
}

function smc_changepi()
{
	if (smc_usertype == 1)
	{
	    var u2 = document.getElementById("user2");
		if (!u2) return smc_error(13);
		
		u2.checked = "checked";
		smc_changeusertype();
	}
	else
		smc_update_button();
}

function smc_changepricing()
{
	smc_update_button();
}

function smc_is_pi_okay()
{
	var pi = document.getElementById("studpi");
	if (!pi) 
	{
		smc_error(12);
		return false;
	}
	
	var v = pi.value;
	if (v.length != 8) return false;
	
	var c = v.charAt(0);
	if (!((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))) return false;
	
	for (var i=1 ; i < 7 ; i++)
	{
		if (v.charAt(i) < '0' || v.charAt(i) > '9') return false;
	}
	
	var c = v.charAt(7);
	if (!((c >= '0' && c <= '9') || c == 'x' || c == 'X')) return false;

	return true;
}

function smc_remove_children(ele)
{
	while (ele.childNodes[0]) ele.removeChild(ele.childNodes[0]);
}

function smc_rehydrate()
{
	try
	{
		smc_rehydrate2();
	}
	catch(err)
	{
		smc_error(15);
	}
}

function smc_rehydrate2()
{
	var ck = document.cookie + ";";
	var i = ck.indexOf("X2SMC=");
	if (i < 0) return;
	
	i += 6;
	
	var j = ck.indexOf(";", i);
	var v = ck.substr(i, j-i);
	
	var vp = v.split("|");
	if (vp.length != 5) return smc_error(14);
	
	if (!smc_rehydrate_qual(vp[0])) return;
	
	if (!smc_rehydrate_path(vp[1])) return;
	
	if (!smc_rehydrate_usertype(vp[2])) return;
	
	smc_fill_pricingareas();
	
	if (!smc_rehydrate_pricingarea(vp[3])) return;
	
	smc_student_pricing_area = vp[4];
}

function smc_rehydrate_qual(q)
{
	var ql = document.getElementById("quallist");
	if (!ql) 
	{
		smc_error(1);
		return false;
	}
	
	for (var i=0 ; i < ql.options.length ; i++)
	{
		if (ql.options[i].value == q)
		{
			ql.selectedIndex = i;
			smc_fillpaths(i)
			return true;
		}
	}
		
	smc_error(16);

	return false;
}

function smc_rehydrate_path(p)
{
	var pl = document.getElementById("pathlist");
	if (!pl) 
	{
		smc_error(4);
		return false;
	}
	
	for (var i=0 ; i < pl.options.length ; i++)
	{
		if (pl.options[i].value == p)
		{
			pl.selectedIndex = i;
			return true;
		}
	}
		
	smc_error(17);

	return false;
}

function smc_rehydrate_usertype(u)
{
	if (u == "ENQ")
	{
	    var u1 = document.getElementById("user1");
		if (!u1) 
		{
			smc_error(10);
			return false;
		}
		u1.checked = true;
		smc_usertype = 1;
		return true;
	}
	
	if (u.length == 8)
	{
	    var u2 = document.getElementById("user2");
		if (!u2) 
		{
			smc_error(13);
			return false;
		}
		u2.checked = true;
		smc_usertype = 2;
	
		var pi = document.getElementById("studpi");
		if (!pi)
		{
			smc_error(12);
			return false;
		}
		pi.value = u;
		return true;
	}
	
	smc_error(18);
	
	return false;
}

function smc_rehydrate_pricingarea(p)
{
    var pa = document.getElementById("pricearea");
	if (!pa) 
	{
		smc_error(9);
		return false;
	}
	
	for (var i=0 ; i < pa.options.length ; i++)
	{
		if (pa.options[i].value == p)
		{
			pa.selectedIndex = i;
			return true;
		}
	}
		
	smc_error(19);

	return false;	
}

function smc_update()
{
    var ql = document.getElementById("quallist");
	if (!ql) return smc_error(1);
    var qc = ql.options[ql.selectedIndex].value;
    if (qc == "0")
    {
    	alert("Select a qualification");
    	return;
    }
    
	var pl = document.getElementById("pathlist");
	if (!pl) return smc_error(4);
    var pc = pl.options[pl.selectedIndex].value;
    if (pc == "0")
    {
    	alert("Select a path");
    	return;
    }
    
    var ut = "ENQ";
    
    if (smc_usertype == 2)
    {
    	if (smc_is_pi_okay() == false)
    	{
    		alert("Enter a valid PI, or select 'Enquirer'");
    		return;
    	}
    	ut = document.getElementById("studpi").value.toUpperCase();
    }    
    
    var pa = document.getElementById("pricearea");
	if (!pa) return smc_error(9);
    var nf = pa.options[pa.selectedIndex].value;
	if (smc_usertype == 1 && nf == "0")
	{
    	alert("Select a pricing area");
    	return;
	}
	
	var ck = qc + "|" + pc + "|" + ut + "|" + nf + "|" + smc_student_pricing_area;

	document.cookie = "X2SMC=" + ck + ";path=/;";
    document.location.href = "module-chooser.aspx";
}
