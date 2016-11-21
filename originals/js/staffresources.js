function validatepi()
{
	var pi = document.forms["newpiform"].inpPI.value.toUpperCase();
	if (pi.length != 8)
	{
		alert("Please enter a valid PI");
		return false;
	}
	if (pi.charCodeAt(0) < 65 || pi.charCodeAt(0) > 90)
	{
		alert("Please enter a valid PI");
		return false;
	}
	for (i=1 ; i < 7 ; i++)
	{
		if (pi.charCodeAt(i) < 48 || pi.charCodeAt(i) > 57)
		{
			alert("Please enter a valid PI");
			return false;
		}
	}
	if ((pi.charCodeAt(7) < 65 || pi.charCodeAt(7) > 90) && (pi.charCodeAt(7) < 48 || pi.charCodeAt(7) > 57))
	{
		alert("Please enter a valid PI");
		return false;
	}
	return true;
}
