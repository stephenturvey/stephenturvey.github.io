function preloadimages()
{
	var i1 = new Image(); i1.src = "img/edittools-on.gif";
	var i3 = new Image(); i3.src = "/includes/img/menu-left-blue.jpg";
	var i4 = new Image(); i4.src = "/includes/img/menu-middle-blue.jpg";
	var i6 = new Image(); i6.src = "/includes/img/menu-right-blue.jpg";
	var i8 = new Image(); i8.src = "/includes/img/menu-faq-blue.jpg";
	var i9 = new Image(); i9.src = "img/more-on.gif";
	var i10 = new Image(); i10.src = "img/editlinks-on.gif";
	var i11 = new Image(); i11.src = "img/arrow-on.gif";
	var i12 = new Image(); i12.src = "img/edit-on.gif";
	var i13 = new Image(); i13.src = "img/more2-on.gif";
	var i14 = new Image(); i14.src = "img/seeall-on.gif";
	var i15 = new Image(); i15.src = "img/schedule-on.gif";
	var i16 = new Image(); i16.src = "img/sb-edit-on.gif";
	var i17 = new Image(); i17.src = "img/sb-delete-on.gif";
	var i18 = new Image(); i18.src = "img/sb-up-on.gif";
	var i19 = new Image(); i19.src = "img/sb-addnewlink-on.gif";
	var i20 = new Image(); i20.src = "img/sb-down-on.gif";
}

function rollimg(o,t)
{
	if (t == 1) o.src = "img/edittools-on.gif";
	if (t == 2) o.src = "img/edittools-off.gif";
	if (t == 3) o.src = "img/more-on.gif";
	if (t == 4) o.src = "img/more-off.gif";
	if (t == 5) o.src = "img/editlinks-on.gif";
	if (t == 6) o.src = "img/editlinks-off.gif";
	if (t == 7) o.src = "img/edit-on.gif";
	if (t == 8) o.src = "img/edit-off.gif";
	if (t == 9) o.src = "img/sb-edit-on.gif";
	if (t == 10) o.src = "img/sb-edit-off.gif";
	if (t == 11) o.src = "img/sb-delete-on.gif";
	if (t == 12) o.src = "img/sb-delete-off.gif";
	if (t == 13) o.src = "img/sb-up-on.gif";
	if (t == 14) o.src = "img/sb-up-off.gif";
	if (t == 15) o.src = "img/sb-addnewlink-on.gif";
	if (t == 16) o.src = "img/sb-addnewlink-off.gif";
	if (t == 17) o.src = "img/sb-down-on.gif";
	if (t == 18) o.src = "img/sb-down-off.gif";
}
