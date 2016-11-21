/*

mc_module_status		Values:-   0: Available
                                   1: Enrolled
                                   2: Exempt
                                   3: In basket  (for enrolled/exempt modules, there will be no pres info)
                                   4: Unavailable due to rules (eg excluded, or credits takes group total over limit)  - Calculated field
                               
mc_groups               Fields:-   0: Min Credits
                                   1: Credits from enrolled/exempt modules
                                   2: Total credits, incl basket (calculated)
                                   3: Group number
                                   4: Module array (indexes into module arrays)
                                   5: Array of excluded combinations (which are themselves arrays of 2 module indexes)
                               
mc_module_pres			Fields:-   0: Pres code
                                   1: Status (0:unselected, 1:selected, 2:unavailable)
                                   2: Year start, based on rolling back CVP start to 1st Oct, Feb or Apr. Format yyyymm
                                   3: Earlest year start this pres can be included in

*/

mc_err = 0;
mc_basket_credits = 0;

mc_img_select = new Image();
mc_img_unselect = new Image();
mc_img_tick = new Image();

function mc_get_group_mincredits(g) { return mc_groups[g][0]; }
function mc_get_stud_credits(g) { return mc_groups[g][1]; }
function mc_get_calc_credits(g) { return mc_groups[g][2]; }
function mc_set_calc_credits(g,v) { mc_groups[g][2]=v; }
function mc_get_group_num(g) { return mc_groups[g][3]; }
function mc_get_group_modules(g) { return mc_groups[g][4]; }
function mc_get_group_exclusions(g) { return mc_groups[g][5]; }

function mc_get_pres_code(p) { return p[0]; }
function mc_get_pres_status(p) { return p[1]; }
function mc_set_pres_status(p,s) { p[1]=s; }
function mc_get_pres_yearstart(p) { return p[2]; }
function mc_get_pres_earliest(p) { return p[3]; }					// Earlest year start
function mc_get_pres_fee(p) { return p[4]; }

function mc_init()
{
	// Preload images into cache..
	mc_img_select.src = "../img/select-on.gif"
	mc_img_unselect.src = "../img/select-off.gif"
	mc_img_tick.src = "../img/tick.gif"
	
	mc_refresh_button_states();
	mc_basket_misc();
}

function mc_refresh_button_states()
{
	var g, gm, m, mst, mp, p, pst, key, ele, fo=999, img, lnk;
	
	mc_apply_rules();
	
	// Find first group that needs to be completed...
	for (g=0 ; g < mc_groups.length ; g++)
	{
		if (mc_get_calc_credits(g) < mc_get_group_mincredits(g))
		{
			fo = g;
			break;
		}
	}
	
	for (g=0 ; g < mc_groups.length ; g++)
	{
		gm = mc_get_group_modules(g);
		for (m=0 ; m < gm.length ; m++)
		{
			mst = mc_module_status[gm[m]];
			
			if (g > fo) mst = 4;	// An earlier group is still incomplete, so force all modules as unavailable
			
			pr = mc_module_pres[gm[m]];
			for (p=0 ; p < pr.length ; p++)
			{
				pst = mc_get_pres_status(pr[p]);
				key = mc_module_codes[gm[m]] + "-" + mc_get_pres_code(pr[p]) + "-" + mc_get_group_num(g);
				ele = mc_get_element(key, 1);
				if (!ele) continue;
				mc_remove_children(ele, 0);
				img = document.createElement("img");
				img.width = "67";
				img.height = "20";

				if (mst == 0 && pst == 0) 
				{
					img.alt = "select";
					img.src = mc_img_select.src;
					lnk = document.createElement("a");
					lnk.href = "javascript:mc_select('" + mc_module_codes[gm[m]] + "', '" + mc_get_pres_code(pr[p]) + "', " + mc_get_group_num(g) + ",0)";
					lnk.appendChild(img);
					ele.appendChild(lnk);
				}
				
				if ((mst == 3 && pst == 0) || mst == 4 || pst == 2) 
				{
					img.alt = "unavailable";
					img.src = mc_img_unselect.src;
					ele.appendChild(img);
				}
				
				if (mst == 3 && pst == 1) 
				{
					img.alt = "selected";
					img.src = mc_img_tick.src;
					ele.appendChild(img);
				}
				
				if (mst == 0 && pst == 1) mc_report_error(2, key);
			}
		}
	}
}

function mc_apply_rules()
{
	// Reset any 'unavailable' modules, so rules below can decide whether it should become unavailable again
	mc_reset_unavailable_modules();
	
	// Calculate total module credits in shopping basket (this is the study intensity)
	mc_update_basket_credits();
	
	// Recalculate how many credits we have towards each group
	mc_recalculate_group_credits();
	
	// Check if any 'available' modules would, if selected, take the group over its credits target
	mc_deselect_modules_on_credits();
	
	// Make unavailable any modules that, if selected, would exceed the max study intensity of 120 credits
	mc_deselect_modules_on_study_intensity();
	
	// Check for excluded combinations, and deselect any modules that would break the rule
	mc_deselect_modules_on_exclusions();
	
	// Deselect any presentations that start before the chosen study year, and finish after it.
	mc_deselect_presentations_on_study_year();
}

function mc_report_error(x,y)
{
	// 1: Missing image element
	// 2: Module unselected, but has selected pres
	// 3: Module code not found
	// 4: Pres code not found
	// 5: Group credits span missing
	// 6: Group number not found
	// 7: Shopping basket elements missing
	// 8: Module title element missing
	// 9: Module start date element missing
	// 10: Basket is full
	// 11: Basket is empty
	
	if (mc_err != 0) return;
	
	mc_err = x;
	alert("Oops!\r\n\r\nReason: " + mc_err + "\r\nDetails: " + y);
}

function mc_find_module(mod)
{
	var m;
	
	for (m=0 ; m < mc_module_codes.length ; m++)
	{
		if (mc_module_codes[m] == mod) return m;
	}
	
	mc_report_error(3, mod);
	
	return -1;
}

function mc_find_pres(m, pres)
{
	var p;
	
	for (p=0 ; p < mc_module_pres[m].length ; p++)
	{
		if (mc_get_pres_code(mc_module_pres[m][p]) == pres) return p;
	}
	
	mc_report_error(4, mc_module_codes[m] + "-" + pres);
	
	return -1;
}

function mc_get_group_index(g)
{
	for (var i=0 ; i < mc_groups.length ; i++)
	{
		if (g == mc_get_group_num(i)) return i;
	}
	
	mc_report_error(6, g);
	
	return -1;
}

function mc_show_friendly_date(sy)
{
	var m, mm;
	
	sy = sy.toString();
	
	m = sy.substr(4, 2);
	if (m == 2) mm = "February ";
	if (m == 4) mm = "April ";
	if (m == 10) mm = "October ";
	return mm + sy.substr(0, 4);
}

function mc_select(mod, pres, group, quiet)
{
	var m, p
	
	m = mc_find_module(mod);
	if (m < 0) return;
	
	if (mc_module_status[m] != 0) return;
	
	p = mc_find_pres(m, pres);
	if (p < 0) return;
	
	mc_set_pres_status(mc_module_pres[m][p], 1);
	mc_module_status[m] = 3;
	mc_basket_fee += mc_get_pres_fee(mc_module_pres[m][p]);
	
	var msg = mod + " has been added to your basket.\r\n\r\n";
	
	if (mc_study_year == 0)
	{
		mc_study_year = mc_get_pres_yearstart(mc_module_pres[m][p]);
		msg += "Your study year will start " + mc_show_friendly_date(mc_study_year) + ". Any other modules you select must start and complete within this year.\r\n\r\n";
	}


	mc_refresh_button_states();
	mc_basket_misc();
	mc_basket_additem(mod, pres, group, mc_module_credits[m], mc_get_pres_fee(mc_module_pres[m][p]), m);
	mc_update_basket_remove();
	
	msg += "Your study intensity is currently " + mc_basket_credits + " credits. ";
	if (mc_basket_credits >= 120)
		msg += "This is the maximum allowed.\r\n\r\n";
	else
		msg += "You may study up to " + (120 - mc_basket_credits) + " more.\r\n\r\n";
	
	var gx = mc_get_group_index(group);
	if (gx >= 0)
	{
		var mcr = mc_get_group_mincredits(gx);
		var ccr = mc_get_calc_credits(gx);
		
		if (ccr >= mcr)
			msg += "This group is now complete.";
		else
			msg += "You need " + (mcr - ccr) + " more credits to complete this group.";
	}
	
	if (quiet == 0) alert(msg);
}

function mc_is_module_active(m)
{
	var st = mc_module_status[m];
	if (st == 1 || st == 2 || st == 3) return 1;
	return 0;
}

function mc_recalculate_group_credits()
{
	var g, cr, m, gm, ele, key;
	
	for (g=0 ; g < mc_groups.length ; g++)
	{
		cr = mc_get_stud_credits(g);		
		gm = mc_get_group_modules(g);
		
		for (m=0 ; m < gm.length ; m++)
		{
			if (mc_is_module_active(gm[m])) cr += mc_module_credits[gm[m]];
		}
		
		mc_set_calc_credits(g, cr);
		
		// Update on-screen group points
		key = "grpts" + mc_get_group_num(g);
		ele = mc_get_element(key, 5);
		if (ele)
		{
			mc_remove_children(ele, 0);
			ele.appendChild(document.createTextNode(cr));
		}
	}

}

function mc_deselect_modules_on_credits()
{
	var g, gm, cr, m, mc;
	
	for (g=0 ; g < mc_groups.length ; g++)
	{
		cr = mc_get_calc_credits(g);		
		mc = mc_get_group_mincredits(g);		
		gm = mc_get_group_modules(g);

		for (m=0 ; m < gm.length ; m++)
		{
			if (mc_module_status[gm[m]] == 0 && cr + mc_module_credits[gm[m]] > mc) mc_module_status[gm[m]] = 4;
		}
	}
}

function mc_deselect_modules_on_exclusions()
{
	var g, ge, gm, m, x;
	
	for (g=0 ; g < mc_groups.length ; g++)
	{
		ge = mc_get_group_exclusions(g);
		if (ge.length == 0) continue;
			
		gm = mc_get_group_modules(g);
	
		for (m=0 ; m < gm.length ; m++)
		{
			if (!mc_is_module_active(gm[m])) continue;
			
			for (x=0 ; x < ge.length ; x++)
			{
				if (gm[m] == ge[x][0]) mc_deselect_module(ge[x][1]);
				if (gm[m] == ge[x][1]) mc_deselect_module(ge[x][0]);
			}
			
		}
	}
}

function mc_deselect_module(m)
{
	if (mc_module_status[m] == 0) mc_module_status[m] = 4;
}

function mc_reset_unavailable_modules()
{
	for (var m=0 ; m < mc_module_status.length ; m++)
	{
		if (mc_module_status[m] == 4) mc_module_status[m] = 0;
	}
}

function mc_update_basket_credits()
{
	mc_basket_credits = 0;
	
	for (var m=0 ; m < mc_module_status.length ; m++)
	{
		if (mc_module_status[m] == 3) mc_basket_credits += mc_module_credits[m];
	}
}

function mc_deselect_modules_on_study_intensity()
{
	for (var m=0 ; m < mc_module_status.length ; m++)
	{
		if (mc_module_status[m] == 0 && mc_module_credits[m] + mc_basket_credits > 120) mc_module_status[m] = 4;
	}
}

function mc_deselect_presentations_on_study_year()
{
	if (mc_study_year == 0) return;		// Study year not chosen yet
	
	var g, gm, m, pr, p, pys, pye;
	
	for (g=0 ; g < mc_groups.length ; g++)
	{
		gm = mc_get_group_modules(g);
		
		for (m=0 ; m < gm.length ; m++)
		{
			if (mc_module_status[gm[m]] != 0) continue;		// Module isn't available anyway
						
			pr = mc_module_pres[gm[m]];
			
			for (p=0 ; p < pr.length ; p++)
			{
				pys = mc_get_pres_yearstart(pr[p]);
				pye = mc_get_pres_earliest(pr[p]);
				if (pys < mc_study_year || mc_study_year < pye) mc_set_pres_status(pr[p], 2);
			}

		}
	}
}

function mc_remove_children(ele, s)
{
	while (ele.childNodes[s]) ele.removeChild(ele.childNodes[s]);
}

function mc_basket_misc()
{
	var ele = mc_get_element("bskstudyyear", 7);
	if (ele)
	{
		mc_remove_children(ele, 0);
		if (mc_study_year > 0) ele.appendChild(document.createTextNode(", starting " + mc_show_friendly_date(mc_study_year)));
	}

	ele = mc_get_element("bskintensity", 7);
	if (ele)
	{
		mc_remove_children(ele, 0);
		ele.appendChild(document.createTextNode(mc_basket_credits));
	}
	
	ele = mc_get_element("bskfee", 7);
	if (ele)
	{
		mc_remove_children(ele, 0);
		ele.appendChild(document.createTextNode(mc_basket_fee));
	}
}

function mc_get_element(nm, er)
{
	var ele = document.getElementById(nm);
	if (!ele) mc_report_error(er, nm);
	return ele;
}

function mc_basket_additem(cc, pr, gr, cr, fee, mx)
{
	if (mc_basket_size == 8)
	{
		mc_report_error(10, cc);
		return;
	}
	
	mc_basket_modules[mc_basket_size] = mx;
	mc_basket_pres[mc_basket_size] = pr;
	mc_basket_group[mc_basket_size] = gr;
	mc_basket_size++;
	
	var ele_tab = mc_get_element("bskitems", 7);
	if (!ele_tab || !ele_tab.tBodies) return;
	
	var ele_tr = document.createElement("tr");
	
	var tt, ele;
	ele = mc_get_element(cc + "-" + gr, 8);
	if (ele && ele.childNodes) tt = ele.childNodes[0].nodeValue;
	
	var ele_td = document.createElement("td");
	ele_td.setAttribute("class", "c1");
	ele_td.appendChild(document.createTextNode(cc + " " + tt));
	ele_tr.appendChild(ele_td);
	
	ele_td = document.createElement("td");
	ele_td.setAttribute("class", "c2");
	ele_td.appendChild(document.createTextNode(cr));
	ele_tr.appendChild(ele_td);
	
	tt = "";
	ele = mc_get_element(cc + "-" + pr + "-" + gr + "a", 9);
	if (ele && ele.childNodes)
	{
		var xx = ele.childNodes[0].nodeValue;
		if (xx)
		{
			var i = xx.indexOf(" ");
			if (i > 0)
			{
				i++;
				var j = xx.indexOf(" ", i);
				if (j > 0) tt = xx.substr(i, 3) + "\u00A0" + xx.substr(j+1, 4);
			}
		}
	}
	
	ele_td = document.createElement("td");
	ele_td.appendChild(document.createTextNode(tt));
	ele_tr.appendChild(ele_td);
	
	ele_td = document.createElement("td");
	ele_td.appendChild(document.createTextNode("\u00A3" + fee));
	ele_tr.appendChild(ele_td);

	ele_tab.tBodies[0].appendChild(ele_tr);
	
	ele = mc_get_element("bskdata", 7);
	if (ele) ele.style.display="block";
	
	ele = mc_get_element("bskempty", 7);
	if (ele) ele.style.display="none";
	
}

function mc_empty_basket()
{
	mc_study_year = 0;
	
	mc_empty_basket2();
	
	var ele = mc_get_element("bskdata", 7);
	if (ele) ele.style.display="none";
	
	ele = mc_get_element("bskempty", 7);
	if (ele) ele.style.display="block";
	
	ele = mc_get_element("bskstudyyear", 7);
	if (ele) mc_remove_children(ele, 0);
	
	mc_refresh_button_states();
}

function mc_empty_basket2()
{
	var pr, p;
	
	mc_basket_fee = 0;
	mc_basket_size = 0;

	for (var m=0 ; m < mc_module_status.length ; m++)
	{
		if (mc_module_status[m] == 3) mc_module_status[m] = 0;
		
		pr = mc_module_pres[m];
		for (p=0 ; p < pr.length ; p++) mc_set_pres_status(pr[p], 0);
	}
		
	var ele = mc_get_element("bskitems", 7);
	if (ele) mc_remove_children(ele.tBodies[0], 1);
}

function mc_update_basket_remove()
{
	if (mc_basket_size == 0)
	{
		mc_report_error(11, "");
		return;
		
	}
	var ele_p = mc_get_element("bskremove", 7);
	if (!ele_p) return;
	
	mc_remove_children(ele_p, 0);
	
	ele_p.appendChild(document.createTextNode("Remove "));

	var ele = document.createElement("a");
	ele.href = "javascript:mc_remove_item(" + mc_basket_modules[mc_basket_size-1] + ")";
	ele.appendChild(document.createTextNode(mc_module_codes[mc_basket_modules[mc_basket_size-1]]));
	ele_p.appendChild(ele);

	if (mc_basket_size == 1) return;
	
	ele_p.appendChild(document.createTextNode(" / "));
	
	ele = document.createElement("a");
	ele.href = "javascript:mc_empty_basket()";
	ele.appendChild(document.createTextNode("All"));
	ele_p.appendChild(ele);
}

function mc_remove_item(m)
{
	if (mc_basket_size == 1)
	{
		mc_empty_basket();
		return;
	}
	
	// Empty basket, then add each item back..
	
	var bs = mc_basket_size - 1;
	
	mc_empty_basket2();
	mc_basket_credits = 0;
		
	for (var b=0 ; b < bs ; b++)
	{
		mc_select(mc_module_codes[mc_basket_modules[b]], mc_basket_pres[b], mc_basket_group[b],1);
	}
}

mc_init();
