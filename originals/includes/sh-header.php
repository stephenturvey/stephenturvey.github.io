<div id="ia-nav">
<ul>
<?php if ($_COOKIE["HS7BDF"]) { ?>
<li><a class="s1" href="https://msds.open.ac.uk/students/index.aspx">StudentHome</a></li>
<li><a class="s2" href="https://msds.open.ac.uk/students/profile.aspx">Profile</a></li>
<li><a class="s3" href="https://msds.open.ac.uk/students/courselist.aspx">Courses</a></li>
<li><a class="s4" href="https://msds.open.ac.uk/students/quallist.aspx">Qualifications</a></li>
<li><a class="s5" href="https://msds.open.ac.uk/students/oulife.aspx">OU Life</a></li>
<li><a class="s6" href="https://msds.open.ac.uk/students/studysupport.aspx">Study Support</a></li>
<li><a class="s7" href="https://msds.open.ac.uk/students/faq.aspx">FAQs</a></li>
<?php } else { ?>
<li><a class="get-me-in" href="https://msds.open.ac.uk/signon/sams001.aspx?nsh=2&amp;URL=http://<?php echo($_SERVER['SERVER_NAME'] . $_SERVER['SCRIPT_NAME'] )?>"><strong>Sign in</strong> for the full experience</a></li>
<li><a class="get-me-in" href="http://www.open.ac.uk/study/"><em>or</em> Register for your first course</a></li>
<?php } ?>
</ul>
</div>