<?php

function vle_showfooter()
{
	$i=error_reporting(E_ERROR);
	include("http://www.open.ac.uk/includes/footer.html");
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
	echo "<script type=\"text/javascript\" src=\"/includes/header.js\"></script>\r\n";
	echo "<script type=\"text/javascript\" src=\"/includes/ioemenu2.js\"></script>\r\n";

	echo "<div id=\"ou-topbar\">";
	echo "<div id=\"ou-lhs\"><a href=\"http://www.open.ac.uk/\"><img src=\"/includes/oulogo_hor.gif\" alt=\"The Open University\" width=\"53\" height=\"38\" /></a><a id=\"ou-skip2\" href=\"#ou-content\">Skip to content</a></div>";
	echo "<div id=\"ou-rhs\">";
	echo "<div id=\"ou-row1\"><ul><li><a id=\"ou-ouhome\" href=\"http://www.open.ac.uk/\">OU Home</a></li><li><a id=\"ou-study\" href=\"http://www3.open.ac.uk/study/\">Study at the OU</a></li><li><a id=\"ou-about\" href=\"http://www3.open.ac.uk/about/\">About the OU</a></li><li><a id=\"ou-research\" href=\"http://www.open.ac.uk/research/\">Research at the OU</a></li><li><a id=\"ou-search\" href=\"http://www.open.ac.uk/search\">Search</a></li><li><a id=\"ou-contact\" href=\"http://www3.open.ac.uk/contact/\">Contact the OU</a></li></ul></div>";
	echo "<div id=\"ou-row2\">&nbsp;</div>";
	echo "<div id=\"ou-row3\"><img src=\"/includes/img/audio-left.gif\" width=\"7\" height=\"11\" alt=\"\" id=\"ou-audiol\" /><a href=\"http://www.open.ac.uk/browsealoud/\" id=\"ou-listen\">Listen to this page</a><img src=\"/includes/img/audio-right.gif\" width=\"7\" height=\"11\" alt=\"\" id=\"ou-audior\" /> <a href=\"http://www.open.ac.uk/accessibility/\" id=\"ou-access\">Accessibility</a></div>";
	echo "</div><div id=\"ou-row5\"></div></div><div id=\"tsxcontent\">";
	
	
	// We only display the menu if a student, or the P14MENU cookie is present (in which case all links go to alias site)
	$e = error_reporting(E_ERROR);
	$fm = $_COOKIE["P14MENU"];
	error_reporting($e);

	if ($fm != "Y" && getenv("HTTP_SAMS_STUDENTPI") == "00000000") return;
	
	$urlhead = "https://msds";
	if ($fm == "Y") $urlhead = "http://csintra1";
	
	

	echo "<div id=\"ioemenu\">";

	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/index.aspx\" class=\"ioem1\">Home</a>";
	
	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/profile.aspx\" class=\"ioem2";
	if ($sel == 2) echo " ioes2";
	echo "\">Profile</a>";
	
	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/courselist.aspx\" class=\"ioem2";
	if ($sel == 3) echo " ioes2";
	echo "\" onmouseover=\"ioe_showmenu(3)\" onmouseout=\"ioe_hidemenu()\" onclick=\"ioe_hidemenu()\">Courses</a>";
		
	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/quallist.aspx\" class=\"ioem2";
	if ($sel == 4) echo " ioes2";
	echo "\" onmouseover=\"ioe_showmenu(4)\" onmouseout=\"ioe_hidemenu()\" onclick=\"ioe_hidemenu()\">Qualifications</a>";
	
	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/studysupport.aspx\" class=\"ioem2\">OU Life</a>";
	
	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/resources.aspx\" class=\"ioem3\">Study support</a>";
	
	echo "<a href=\"" . $urlhead . ".open.ac.uk/students/faq.aspx\" class=\"ioem4\">FAQs</a>";

	echo "</div><div id=\"ioemenu2\"></div><div style=\"clear:both;\"></div><script type=\"text/javascript\">//<![CDATA[\n";
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

?>
