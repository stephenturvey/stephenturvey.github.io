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

function mc_init()
{
	// Preload images into cache..
	mc_img_select.src = "../img/select-on.gif"
	mc_img_unselect.src = "../img/select-off.gif"
	mc_img_tick.src = "../img/tick.gif"
	
	mc_refresh_button_states();
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
				ele = document.getElementById(key);
				if (!ele)
				{
					mc_report_error(1, key);
					continue;
				}
				if (ele.childNodes[0]) ele.removeChild(ele.childNodes[0]);
				img = document.createElement("img");
				img.width = "67";
				img.height = "20";

				if (mst == 0 && pst == 0) 
				{
					img.alt = "select";
					img.src = mc_img_select.src;
					lnk = document.createElement("a");
					lnk.href = "javascript:mc_select('" + mc_module_codes[gm[m]] + "', '" + mc_get_pres_code(pr[p]) + "', " + mc_get_group_num(g) + ")";
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

function mc_show_friendly_studyyear(sy)
{
	var m, mm;
	
	sy = sy.toString();
	
	m = sy.substr(4, 2);
	if (m == 2) mm = "February ";
	if (m == 4) mm = "April ";
	if (m == 10) mm = "October ";
	return mm + sy.substr(0, 4);
}

function mc_select(mod, pres, group)
{
	var m, p;
	
	m = mc_find_module(mod);
	if (m < 0) return;
	
	if (mc_module_status[m] != 0) return;
	
	p = mc_find_pres(m, pres);
	if (p < 0) return;
	
	mc_set_pres_status(mc_module_pres[m][p], 1);
	mc_module_status[m] = 3;
	// TODO: Update shopping basket
	
	var msg = mod + " has been added to your basket.\r\n\r\n";
	
	if (mc_study_year == 0)
	{
		mc_study_year = mc_get_pres_yearstart(mc_module_pres[m][p]);
		msg += "Your study year will start " + mc_show_friendly_studyyear(mc_study_year) + ". Any other modules you select must start and complete within this year.\r\n\r\n";
	}


	mc_refresh_button_states();
	

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
	
	alert(msg);
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
		ele = document.getElementById(key);
		if (!ele)
			mc_report_error(5, key);
		else
		{
			ele.removeChild(ele.childNodes[0]);
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


mc_init();
