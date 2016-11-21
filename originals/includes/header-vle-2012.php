<?php

function vle_showheader($sel, $force)
{
	$e = error_reporting(E_ERROR);
	
	$fm = $_COOKIE["P14MENU"];
	$sc = $_COOKIE["SAMS2session"];
	
	error_reporting($e);

	$menutype = 0;
	
	if ($force == "student") $menutype = 1;
	if ($force == "tutor") $menutype = 2;
	
	if ($menutype == 0)
	{
		if ($fm == "Y") $menutype = 1;
		$p = strpos($sc, "samsStudentPI=");
		if ($p !== FALSE) $menutype = 1;
		if ($menutype == 0)
		{
			$p = strpos(getenv("HTTP_SAMS_AUTHID_MATCH"), "00000005");
			if ($p !== FALSE) $menutype = 2;
		}
	}
	
	if ($menutype == 2) vle_showtutorhomeheader();
		
	if ($menutype != 1) return;

	$urlhead = "https://msds";
	if ($fm == "Y" && $force != "on") $urlhead = "http://csintra1";
	
	echo "<div class=\"sh-header\">";
	echo "<ul>";
	echo "<li class=\"sh-home\"><a href=\"" . $urlhead . ".open.ac.uk/students/index.aspx\">StudentHome</a></li>";
	
	echo "<li class=\"sh-profile\"><a href=\"" . $urlhead . ".open.ac.uk/students/profile.aspx\"";
	if ($sel == 2) echo " class=\"selected\"";
	echo ">Profile</a></li>";
	
	echo "<li class=\"sh-study\"><a href=\"" . $urlhead . ".open.ac.uk/students/study.aspx\"";
	if ($sel == 3) echo " class=\"selected\"";
	echo ">Study</a></li>";
	
	echo "<li class=\"sh-community\"><a href=\"" . $urlhead . ".open.ac.uk/students/oulife.aspx\">Community</a></li>";
	
	echo "<li class=\"sh-help\"><a href=\"" . $urlhead . ".open.ac.uk/students/help.aspx\">Help Centre</a></li>";
	
	echo "</ul></div><div style=\"clear:both;\">";
}

function vle_getmenucookie()
{
	$e = error_reporting(E_ERROR);
	$ck = $_COOKIE["IOEMENU"];
	error_reporting($e);
	
	$ck2 = explode("*", $ck);
	if (count($ck2) < 6) return FALSE;
		
	return $ck2;
}

function vle_GetActualCoursePres($id, &$pres)
{
	$v = vle_getmenucookie();
	if ($v === FALSE) return FALSE;
	
	if ($v[2] == "") return FALSE;
	$vle_courses = explode(",", $v[2]);
	$numcourses = count($vle_courses);
	if ($numcourses == 0) return FALSE;
	
	for ($i=0 ; $i < $numcourses ; $i++)
	{
		$c = explode("_", $vle_courses[$i]);
		if ($c[3] == $id) 
		{
			$pres = $c[1];
			return $c[0];
		}
	}
	
	return FALSE;
}

function vle_showtutorhomeheader()
{
	echo "<script type=\"text/javascript\">//<![CDATA[";
	echo "function showfeedback()";
	echo "{window.open(\"https://msds.open.ac.uk/tutorhome/feedback.aspx\",\"feedback\",\"scrollbars=yes,resizable=yes,width=440,height=500,menubar=no,toolbar=no\");}";
	echo "//]]></script>";
	echo "<div style=\"font-family:Verdana, Geneva, Arial, Helvetica, sans-serif;font-size:xx-small;\">";
	echo "<div style=\"padding:2px 2px 2px 1px;height:30px;border-top:1px solid #b5deff;margin:0 4px 0 0;font-size:105%;\">";
	echo "<div style=\"float:right;margin:3px 0 2px 3px;color:#84848b;font-size:120%;\"><span style=\"position:relative;bottom:2px;font-weight:bold\"><span style=\"color:#59a6e7;font-weight:normal;\">[ <a href=\"http://www.open.ac.uk/tutors/atoz.php\" style=\"color:#59a6e7;text-decoration:none;font-weight:bold;\">a-z</a> | <a href=\"http://www.open.ac.uk/tutors/guide.php\" style=\"color:#59a6e7;text-decoration:none;font-weight:bold;\">help</a> | <a href=\"javascript:showfeedback()\" style=\"color:#59a6e7;text-decoration:none;font-weight:bold;\">feedback</a> ]</span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Search <strong style=\"color:#2e2c2e;\">TutorHome</strong></span>";
	echo "<form method=\"get\" action=\"http://search.open.ac.uk/internal/search/results\" style=\"display:inline;\"><div style=\"display:inline\">";
	echo "<input name=\"action\" type=\"hidden\" value=\"search\" />";
	echo "<input name=\"q\" type=\"text\" style=\"font-size:110%;font-family:Verdana,Geneva,Arial,Helvetica,sans-serif;margin:0 4px\" />";
	echo "<input type=\"submit\" value=\"go\" class=\"sb\" style=\"font-size:110%;font-family:Verdana,Geneva,Arial,Helvetica,sans-serif;padding:0 1px 2px 1px;margin:0 0 1px 0;\" /></div>";
	echo "</form>";
	echo "</div>";
	echo "<a href=\"https://msds.open.ac.uk/tutorhome/\"><img src=\"https://msds.open.ac.uk/tutorhome/img/tutorhome.gif\" width=\"149\" height=\"22\" alt=\"TutorHome\" style=\"margin:4px 0 0 2px;padding:0;border:none;\" /></a>";
	echo "</div>";
	echo "<div style=\"background-color:#d4eafe;margin:2px 4px 18px 4px;text-align:right;font-weight:normal;border-bottom:1px solid #7ac6e7;font-size:120%;\">"; 
	echo "<ul style=\"margin:0;padding:5px 10px;display:block;\">";
	echo "<li style=\"display:inline;margin:0;padding:0;list-style-type:none;\"><a href=\"https://msds.open.ac.uk/tutorhome/\" style=\"text-decoration:none;color:#797a7b;font-weight:bold;background-color:transparent;padding:2px 6px;margin:0;border-right:1px solid #7ac6e7;\">Home</a></li>";
	echo "<li style=\"display:inline;margin:0;padding:0;list-style-type:none;\"><a href=\"https://msds.open.ac.uk/tutorhome/students.aspx\"  style=\"text-decoration:none;color:#797a7b;font-weight:bold;background-color:transparent;padding:2px 6px;margin:0;border-right:1px solid #7ac6e7;\">Students</a></li>";
	echo "<li style=\"display:inline;margin:0;padding:0;list-style-type:none;\"><a href=\"http://students.open.ac.uk/dashboard/\" style=\"text-decoration:none;color:#797a7b;font-weight:bold;background-color:transparent;padding:2px 6px;margin:0;border-right:1px solid #7ac6e7;\">Dashboard</a></li>";
	echo "<li style=\"display:inline;margin:0;padding:0;list-style-type:none;\"><a href=\"https://msds.open.ac.uk/tutorhome/region.aspx\" style=\"text-decoration:none;color:#797a7b;font-weight:bold;background-color:transparent;padding:2px 6px;margin:0;border-right:1px solid #7ac6e7;\">Region/Nation</a></li>";
	echo "<li style=\"display:inline;margin:0;padding:0;list-style-type:none;\"><a href=\"http://www.open.ac.uk/tutors/development/\" style=\"text-decoration:none;color:#797a7b;font-weight:bold;background-color:transparent;padding:2px 6px;margin:0;border-right:1px solid #7ac6e7;\">Teaching &amp; Learning</a></li>";
	echo "<li style=\"display:inline;margin:0;padding:0;list-style-type:none;\"><a href=\"https://msds.open.ac.uk/tutorhome/university.aspx\" style=\"text-decoration:none;color:#797a7b;font-weight:bold;background-color:transparent;padding:2px 6px;margin:0;border-right:1px solid #7ac6e7;\">University</a></li>";
	echo "<li style=\"display:inline;margin:0;padding:0;list-style-type:none;\"><a href=\"https://msds.open.ac.uk/tutorhome/personal.aspx\" style=\"text-decoration:none;color:#797a7b;font-weight:bold;background-color:transparent;padding:2px 0 2px 6px;margin:0;\">Your employment</a></li>";
	echo "</ul>";
	echo "</div>";
	echo "</div>";
}

// Make sure no white space exists after the closing PHP tag

?>