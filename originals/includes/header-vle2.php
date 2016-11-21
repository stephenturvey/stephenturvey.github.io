<?php

function vle_showfooter()
{
	$i=error_reporting(E_ERROR);
	include("http://www.open.ac.uk/includes/footer-09.html");
	error_reporting($i);
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

function vle_showheader($sel)
{
	echo "<script type=\"text/javascript\" src=\"/includes/header-vle.js\"></script>\r\n";
	echo "<script type=\"text/javascript\">if (typeof window.ou_sitestat=='function')ou_sitestat();</script>";
	echo "<script type=\"text/javascript\" src=\"/includes/ioxmenu-vle.js\"></script>\r\n";

	echo "<div id=\"ouskip\"><a id=\"ou-skip5\" href=\"#ou-content\">Skip to content</a></div><div id=\"ouheader\" class=\"wide\">\r\n";
	echo "<a href=\"http://www.open.ac.uk/\"><img src=\"/includes/headers-footers/oulogo-56.jpg\" alt=\"The Open University\" width=\"83\" height=\"56\" id=\"ounewlogo\" /></a>\r\n";
	echo "<ul id=\"ouheader1\"><li class=\"first\"><a href=\"http://www.open.ac.uk/browsealoud/\">Listen to this page</a></li><li><a href=\"http://www.open.ac.uk/accessibility/\">Accessibility</a></li><li id=\"ou-person\" class=\"hide\"></li><li id=\"ou-studenthome\" class=\"hide\"><a href=\"https://msds.open.ac.uk/students/\">StudentHome</a></li><li id=\"ou-tutorhome\" class=\"hide\"><a href=\"https://msds.open.ac.uk/tutorhome/\">TutorHome</a></li><li id=\"ou-intranet\" class=\"hide\"><a href=\"http://intranet.open.ac.uk/oulife-home/\">IntranetHome</a></li><li id=\"ou-signout\" class=\"hide\"><a class=\"ou-key\" href=\"https://msds.open.ac.uk/signon/samsoff.aspx\">Sign out</a></li><li id=\"ou-signin1\"><a class=\"ou-key\" id=\"ou-signin2\" href=\"https://msds.open.ac.uk/signon/sams001.aspx\">Sign in</a></li><li><a href=\"http://www3.open.ac.uk/contact/\">Contact us</a></li></ul>\r\n";
	echo "<ul id=\"ouheader2\"><li class=\"first\"><a href=\"http://www.open.ac.uk/\">The Open University</a></li><li><a href=\"http://www3.open.ac.uk/study/\">Study at the OU</a></li><li><a href=\"http://www3.open.ac.uk/about/\">About the OU</a></li><li><a href=\"http://www.open.ac.uk/research/\">Research at the OU</a></li><li><a href=\"http://www.open.ac.uk/search\">Search the OU</a></li></ul>\r\n";
	echo "</div><div style=\"clear:both\"></div><div>\r\n";	
	
	// We only display the menu if a student, or the P14MENU cookie is present (in which case all links go to alias site)
	$e = error_reporting(E_ERROR);
	$fm = $_COOKIE["P14MENU"];
	$sc = $_COOKIE["SAMS2session"];
	error_reporting($e);

	if ($fm != "Y" && strpos($sc, "samsStudentPI=") == FALSE)
	{
		vle_showtutorhomeheader();
		return;
	}
	
	$urlhead = "https://msds";
	if ($fm == "Y") $urlhead = "http://csintra1";
	
	

	echo "<div id=\"fsvlemenu\">";

	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/index.aspx\" class=\"fsvlem1\">StudentHome</a>";
	
	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/profile.aspx\" class=\"fsvlem2";
	if ($sel == 2) echo " fsvles2";
	echo "\">Profile</a>";
	
	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/courselist.aspx\" class=\"fsvlem3";
	if ($sel == 3) echo " fsvles3";
	echo "\" onmouseover=\"ioe_showmenu(3)\" onmouseout=\"ioe_hidemenu()\" onclick=\"ioe_hidemenu()\">Modules</a>";
		
	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/quallist.aspx\" class=\"fsvlem4";
	if ($sel == 4) echo " fsvles4";
	echo "\" onmouseover=\"ioe_showmenu(4)\" onmouseout=\"ioe_hidemenu()\" onclick=\"ioe_hidemenu()\">Qualifications</a>";
	
	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/studysupport.aspx\" class=\"fsvlem3\">OU Life</a>";
		
	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/help.aspx\" class=\"fsvlem5\">Help</a>";

	echo "</div><div id=\"fsvlemenu2\"></div><div style=\"clear:both;\"></div><script type=\"text/javascript\">//<![CDATA[\n";
	vle_createmenuvariables();
	echo "\nioe_createmenus();\r\n//]]></script>";
}

function vle_createmenuvariables()
{
	$v = vle_getmenucookie();
	if ($v === FALSE) 
	{
		echo "var ioe_numcrse=0;\r\n";
		echo "var ioe_numqual=0;\r\n";
		return;
	}

	echo "var ioe_crsewidth=" . $v[0] . ";\r\n";
	echo "var ioe_qualwidth=" . $v[1] . ";\r\n";
	echo "var ioe_crsemore=" . $v[4] . ";\r\n";
	echo "var ioe_qualmore=" . $v[5] . ";\r\n";
	
	if ($v[2] == "")
		$numcourses = 0;
	else
	{
		$vle_courses = explode(",", $v[2]);
		$numcourses = count($vle_courses);
	}
	
	if ($v[3] == "")
		$numquals = 0;
	else
	{
		$vle_quals = explode(",", $v[3]);
		$numquals = count($vle_quals);
	}

	echo "var ioe_numcrse=" . $numcourses . ";\r\n";
	echo "var ioe_numqual=" . $numquals . ";\r\n";
	
	if ($numcourses == 0 && $numquals == 0) return;

	$pr3offset = 0;
	$mapoffset = 0;
	
	$fh = vle_initsearch($pr3offset, $mapoffset);
	
	$codes = "";
	$pres = "";
	$type = "";
	$titles = "";
	
	if ($numcourses > 0)
	{
		for ($i=0 ; $i < $numcourses ; $i++)
		{
			$c = explode("_", $vle_courses[$i]);
			if ($i > 0)
			{
				$codes .= ",";
				$pres .= ",";
				$type .= ",";
				$titles .= ",";
			}
			$codes .= "\"" . $c[0] . "\"";
			$pres .= "\"" . $c[1] . "\"";
			$type .= $c[2];
			$titles .= "\"" . vle_fetchtitle($fh, $pr3offset, $mapoffset, $c[0]) . "\"";
		}
		
		echo "var ioe_course=[" . $codes . "];\r\n";
		echo "var ioe_pres=[" . $pres . "];\r\n";
		echo "var ioe_crsetype=[" . $type . "];\r\n";
		echo "var ioe_crsetitle=[" . $titles . "];\r\n";
	}

	$codes = "";
	$titles = "";
	$t = "";
	
	if ($numquals > 0)
	{
		for ($i=0 ; $i < $numquals ; $i++)
		{
			if ($i > 0)
			{
				$codes .= ",";
				$titles .= ",";
			}
			$j = strpos($vle_quals[$i], "_");
			if ($vle_quals[$i][0] >= '1' && $vle_quals[$i][0] <= '9')
			{
				if ($j == 1)
				{
					$codes .= "\"" . $vle_quals[$i][0] . "\"";
					$titles .= "\"" . substr($vle_quals[$i], 2) . "\"";
				}
				else
				{
					$codes .= "\"XX\"";
					$titles .= "\"Thesis\"";
				}
			}
			else
			{
				$codes .= "\"" . $vle_quals[$i] . "\"";
				if ($j > 1)
				{
					$c = substr($vle_quals[$i], 0, $j);
					$t = vle_fetchtitle($fh, $pr3offset, $mapoffset, $c);
					if ($t == "") $t = $c;
				}
				else
					$t = $vle_quals[$i];
				$titles .= "\"" . $t . "\"";
			}
		}
		
		echo "var ioe_qualocc=[" . $codes . "];\r\n";
		echo "var ioe_qualtitle=[" . $titles . "];\r\n";
	}


	if ($fh) fclose($fh);
}

function vle_initsearch(&$pr3offset, &$mapoffset)
{
	$i = strrpos(__FILE__, "/");
	$datafile = substr(__FILE__, 0, $i) . "/data/cqsearch.dat";
	
	if (!file_exists($datafile)) return FALSE;
	
	$fh = fopen($datafile, "rb");
	if ($fh === FALSE) return FALSE;
	
	$pr3offset = ord(fgetc($fh)) + ord(fgetc($fh)) * 256;
	$mapoffset = ord(fgetc($fh)) + ord(fgetc($fh)) * 256;

	return $fh;
}

function vle_fetchtitle($fh, $pr3offset, $mapoffset, $code)
{
	if ($fh === FALSE) return "";
	
	while (strlen($code) < 8) $code .= " ";
	
	fseek($fh, 4 + (ord($code[0]) - 65) * 2, SEEK_SET);
	$pr2ptr = ord(fgetc($fh)) + ord(fgetc($fh)) * 256;
	if ($pr2ptr == 9999) return "";

	fseek($fh, 56 + $pr2ptr * 4, SEEK_SET);
	
	$pr3ptr = 65535;
	while (!feof($fh))
	{
		$pr2 = fread($fh, 2);
		$c = strncmp($pr2, $code, 2);
		if ($c == 0)
		{
			$pr3ptr = ord(fgetc($fh)) + ord(fgetc($fh)) * 256;
			break;
		}
		if ($c > 0) break;
		fseek($fh, 2, SEEK_CUR);
	}
	
	if ($pr3ptr == 65535) return "";

	fseek($fh, $pr3offset + $pr3ptr * 5, SEEK_SET);
	
	$mapptr = 65535;
	while (!feof($fh))
	{
		$pr3 = fread($fh, 3);
		$c = strncmp($pr3, $code, 3);
		if ($c == 0)
		{
			$mapptr = ord(fgetc($fh)) + ord(fgetc($fh)) * 256;
			break;
		}
		if ($c > 0) break;
		fseek($fh, 2, SEEK_CUR);
	}
	
	if ($mapptr == 65535) return "";

	fseek($fh, $mapoffset + $mapptr * 16, SEEK_SET);
	
	$resptr = FALSE;
	while (!feof($fh))
	{
		$map = fread($fh, 8);
		$c = strncmp($map, $code, 8);
		if ($c == 0)
		{
			$resptr = fread($fh, 8);
			break;
		}
		if ($c > 0) break;
		fseek($fh, 8, SEEK_CUR);
	}
	
	if ($resptr === FALSE) return "";
		
	fseek($fh, $resptr, SEEK_SET);
	
	$i = ord(fgetc($fh));
	if ($i < 1 || $i >= 80) return "";
	
	return fread($fh, $i);
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

function vle_showmobileheader($sel)
{
	echo "<div style=\"margin:0;padding:4px;text-align:right;font-size:xx-small;font-family:sans-serif\">\r\n";
	echo "<img src=\"/includes/headers-footers/oulogo-56.jpg\" alt=\"The Open University\" width=\"83\" height=\"56\" style=\"float:left;padding-bottom:4px\" />\r\n";
	echo "<a href=\"http://www.open.ac.uk/mobile/\" style=\"border:1px #ccc solid;padding:1px;text-decoration:none\">OU Home</a>\r\n";
	echo "</div><div style=\"clear:both\"></div>\r\n";
	
	// We only display the menu if a student, or the P14MENU cookie is present (in which case all links go to alias site)
	$e = error_reporting(E_ERROR);
	$fm = $_COOKIE["P14MENU"];
	$sc = $_COOKIE["SAMS2session"];
	error_reporting($e);

	if ($fm != "Y" && strpos($sc, "samsStudentPI=") == FALSE) return;
	
	$urlhead = "https://msds";
	if ($fm == "Y") $urlhead = "http://csintra1";
	
	echo "<div id=\"mbvlemenu2\"><div id=\"mbvlemenu\">";
	
	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/index.aspx\">StudentHome</a> ";
	
	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/profile.aspx\"";
	if ($sel == 2) echo " class=\"sel\"";
	echo ">Profile</a> ";
	
	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/courselist.aspx\"";
	if ($sel == 3) echo " class=\"sel\"";
	echo ">Modules</a> ";

	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/quallist.aspx\"";
	if ($sel == 4) echo " class=\"sel\"";
	echo ">Qualifications</a> ";

	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/oulife.aspx\">OU&nbsp;Life</a> ";
	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/help.aspx\">Help</a> ";

	echo "</div></div>\n";
}

function vle_showtutorhomeheader()
{
	if (strpos(getenv("HTTP_SAMS_AUTHID_MATCH"), "00000005") === FALSE) return;	// Only show to ALs
	
	echo "<script type=\"text/javascript\">//<![CDATA[";
	echo "function showfeedback()";
	echo "{window.open(\"https://msds.open.ac.uk/tutorhome/feedback.aspx\",\"feedback\",\"scrollbars=yes,resizable=yes,width=440,height=500,menubar=no,toolbar=no\");}";
	echo "//]]></script>";
	echo "<div style=\"font-family:Verdana, Geneva, Arial, Helvetica, sans-serif;font-size:xx-small;\">";
	echo "<div style=\"padding:2px 2px 2px 1px;height:30px;border-top:1px solid #b5deff;margin:0 4px 0 0;font-size:105%;\">";
	echo "<div style=\"float:right;margin:3px 0 2px 3px;color:#84848b;font-size:120%;\"><span style=\"position:relative;bottom:2px;font-weight:bold\"><span style=\"color:#59a6e7;font-weight:normal;\">[ <a href=\"http://www.open.ac.uk/tutors/atoz.php\" style=\"color:#59a6e7;text-decoration:none;font-weight:bold;\">a-z</a> | <a href=\"http://www.open.ac.uk/tutors/guide.php\" style=\"color:#59a6e7;text-decoration:none;font-weight:bold;\">help</a> | <a href=\"javascript:showfeedback()\" style=\"color:#59a6e7;text-decoration:none;font-weight:bold;\">feedback</a> ]</span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Search <strong style=\"color:#2e2c2e;\">TutorHome</strong></span>";
	echo "<form method=\"get\" action=\"http://search.open.ac.uk/internal\" style=\"display:inline;\"><div style=\"display:inline\">";
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