function codefinder()
{
	clearerrors();

    var c = document.getElementById("productcode").value;
    if (c.length == 0) return false;
    c = c.toUpperCase();

	var u = null;
	var check = 1;

	if (c.length < 4)
	{
		if (c.charAt(0) == 'B') check = 0;
	}

    if (check == 1) u = cqf_findcoursequal_new(c);

    if (u == null)
    {
	    document.getElementById("codenotfound").appendChild(document.createTextNode("No description found for " + c + "."));
        return false;
    }

    document.location.href = u;

	return false;
}

function clearerrors()
{
 	var obj = document.getElementById("codenotfound");
	while(obj.firstChild) obj.removeChild(obj.firstChild);

 	obj = document.getElementById("modsrcherr");
	while(obj.firstChild) obj.removeChild(obj.firstChild);

 	obj = document.getElementById("qualsrcherr");
	while(obj.firstChild) obj.removeChild(obj.firstChild);
}

function validate_module_search()
{
	clearerrors();

 	if (document.getElementById("modlv").selectedIndex > 0) return true;
 	if (document.getElementById("modcr").selectedIndex > 0) return true;
 	if (document.getElementById("modsd").selectedIndex > 0) return true;
 	if (document.getElementById("modsubj").selectedIndex > 0) return true;
 	if (document.getElementById("modrsch").selectedIndex > 0) return true;
 	if (document.getElementById("modexam").selectedIndex > 0) return true;
    if (document.getElementById("modnew").checked) return true;

    document.getElementById("modsrcherr").appendChild(document.createTextNode("Select an option above to filter your search."));

	return false;
}

function validate_qual_search()
{
	clearerrors();

 	if (document.getElementById("quallv").selectedIndex > 0) return true;
 	if (document.getElementById("qualtype").selectedIndex > 0) return true;
 	if (document.getElementById("qualsubj").selectedIndex > 0) return true;

    document.getElementById("qualsrcherr").appendChild(document.createTextNode("Select an option above to filter your search."));

	return false;
}

function reset_module_search()
{
	clearerrors();

	document.getElementById("modlv").selectedIndex = 0;
	document.getElementById("modcr").selectedIndex = 0;
	document.getElementById("modsd").selectedIndex = 0;
	document.getElementById("modsubj").selectedIndex = 0;
	document.getElementById("modrsch").selectedIndex = 0;
	document.getElementById("modexam").selectedIndex = 0;
document.getElementById("modnew").checked = false;
}

function reset_qual_search()
{
	clearerrors();

	document.getElementById("quallv").selectedIndex = 0;
	document.getElementById("qualtype").selectedIndex = 0;
	document.getElementById("qualsubj").selectedIndex = 0;
}
