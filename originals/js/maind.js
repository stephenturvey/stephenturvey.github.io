var sbAjax=false;
if (GetHttpObj()) sbAjax=true;	// Test if browser supports AJAX

var sbMotion=[];
var sbMotionMax=8;
var sbMotionTimer=null;
var sbMotionMsgId = 0;
var sbMotionMsgTitle = null;
var sbMotionMsgDesc = null;

for (sb=0 ; sb < sbMotionMax ; sb++)
{
	sbMotion[sb]=new Object();
	sbMotion[sb].obj=null;
	sbMotion[sb].pos=0;
	sbMotion[sb].height=0;
	sbMotion[sb].action=0;
	sbMotion[sb].seq=0;
	sbMotion[sb].starttime=null;
}

function InitNewsAjax(n1, n2, n3)
{
	if (!sbAjax) return;	// If AJAX not supported, quit here
	
	InitNewsAjax2(n1);
	InitNewsAjax2(n2);
	InitNewsAjax2(n3);
}

function InitNewsAjax2(n)
{
	var obj=document.getElementById("mtnm" + n + "a");
	if (obj) obj.setAttribute("href", "javascript:sbMessage('" + n + "')");
}

function InitAlertAjax(n)
{
	var obj=document.getElementById("mtnalert" + n + "a");
	if (obj) obj.setAttribute("href", "javascript:sbAlert('" + n + "')");
}

function InitModuleAjax(n,c)
{
	var obj=document.getElementById("mtn" + n + "a");
	if (obj) 
	{
		if (c == 0)
			obj.setAttribute("href", "javascript:sbExpand('mtn" + n + "','x" + n + "')");
		else
			obj.setAttribute("href", "javascript:sbCollapse('mtn" + n + "','x" + n + "')");
	}
}

function GetHttpObj()
{
	var hr = null;
	
	try
	{
		if (window.XMLHttpRequest)
			hr = new XMLHttpRequest(); 
		else
		{
			if (window.ActiveXObject)
			{
				try
				{
					hr = new ActiveXObject("Msxml2.XMLHTTP");
				}
				catch(e)
				{
					hr = new ActiveXObject("Microsoft.XMLHTTP");
				}
			}
		}
	}
	catch(e) {}

	return hr;	
}

function sbMessage(id)
{
	sbStartMotion("mtnm"+id+"b",3,1);
	
	var r = GetHttpObj();
	
	r.onreadystatechange = function()
	{
		if (r.readyState == 4 && r.status == 200) sbNextMessage(r.responseText);
	}
	
	r.open("GET", "action/remove-message-ajax.aspx?id=" + id, true);
	r.send(null); 
}

function sbAlert(id)
{
	sbStartMotion("mtnalert"+id+"b",3,2);
	var d = new Date()
	var i = new Image();
	i.src = "action/remove-message-ajax.aspx?id=" + id + "&a=1&xx=" + d.getMilliseconds();
}

function sbModule(id)
{
	sbStartMotion("mtn"+id+"b",1,0);
	
	var r = GetHttpObj();
		
	r.open("GET", "action/remove-message-ajax.aspx?id=" + id, true);
	r.send(null); 
}

//Act: 1:Rollup,2:Rolldown,3:Fadeout,4:Fadein
//Seq: 0:None, 1:Fadeout-Rollup-ShowMsg, 2:Fadeout-Rollup, 3:Fadeout-DisplayNone
function sbStartMotion(objid,act,seq)
{
	var obj=document.getElementById(objid);
	if (!obj) return;
	var sb;
	for (sb=0 ; sb < sbMotionMax ; sb++)
	{
		if (sbMotion[sb].obj == obj)
		{
			sbMotion[sb].starttime=new Date();
			if (sbMotion[sb].action == 1) { sbMotion[sb].action=2; sbMotion[sb].pos = 10-sbMotion[sb].pos; return; }
			if (sbMotion[sb].action == 2) { sbMotion[sb].action=1; sbMotion[sb].pos = 10-sbMotion[sb].pos; return; }
			return;
		}
	}
	for (sb=0 ; sb < sbMotionMax ; sb++)
	{
		if (sbMotion[sb].obj == null)
		{
			sbMotion[sb].obj=obj;
			sbMotion[sb].pos=0;
			var oh=obj.clientHeight;
			obj.style.height='auto';
			sbMotion[sb].height=obj.clientHeight;
			obj.height=oh;
			sbMotion[sb].action=act;
			sbMotion[sb].seq=seq;
			sbMotion[sb].starttime=new Date();
			if (sbMotionTimer == null)
			{
				sbGoMotion();
				sbMotionTimer=window.setInterval('sbGoMotion()', 40);
			}
			break;
		}
	}
}

function sbGoMotion()
{
	var sb;
	var sb2=0;
	for (sb=0 ; sb < sbMotionMax ; sb++)
	{
		if (sbMotion[sb].obj != null)
		{
			sbMotion[sb].pos+=2;
			if (new Date() - sbMotion[sb].starttime > 350) sbMotion[sb].pos=10;
			if (sbMotion[sb].action == 1) sbMotion[sb].obj.style.height = sbMotion[sb].height*(10-sbMotion[sb].pos)/10 + 'px';
			if (sbMotion[sb].action == 2) sbMotion[sb].obj.style.height = sbMotion[sb].height*sbMotion[sb].pos/10 + 'px';
			if (sbMotion[sb].action == 3)
			{
				sbMotion[sb].obj.style.opacity = (10-sbMotion[sb].pos)/10;
				sbMotion[sb].obj.style.filter = "alpha(opacity=" + (100-sbMotion[sb].pos*10) + ")";
			}
			if (sbMotion[sb].action == 4)
			{
				sbMotion[sb].obj.style.opacity = sbMotion[sb].pos/10;
				sbMotion[sb].obj.style.filter = "alpha(opacity=" + sbMotion[sb].pos*10 + ")";
			}
			if (sbMotion[sb].pos == 10)
			{
				if (sbMotion[sb].seq == 0) sbMotion[sb].obj=null;
				if (sbMotion[sb].seq == 1)
				{
					if (sbMotion[sb].action == 3)
					{
						sbMotion[sb].action=1;
						sbMotion[sb].pos=0;
						sbMotion[sb].starttime=new Date();
						sb2=1;
					}
					else
					{
						sbMotion[sb].obj=null;
						if (sbMotionMsgId > 0)
							sbShowMsg();
						else
							sbMotionMsgId = -1;
					}
				}
				if (sbMotion[sb].seq == 2)
				{
					if (sbMotion[sb].action == 3)
					{
						sbMotion[sb].action=1;
						sbMotion[sb].pos=0;
						sbMotion[sb].starttime=new Date();
						sb2=1;
					}
					else
						sbMotion[sb].obj=null;
				}
				if (sbMotion[sb].seq == 3)
				{
					sbMotion[sb].obj.style.display='none';
					sbMotion[sb].obj=null;
				}
			}
			else
				sb2=1;
		}
	}
	if (sb2==0)
	{
		window.clearInterval(sbMotionTimer);
		sbMotionTimer=null;
	}
}

function sbCollapse(itm,sct)
{
	sbStartMotion(itm + "b",1,0);
	var obj=document.getElementById(itm + "a");
	obj.setAttribute("href", "javascript:sbExpand('" + itm + "','" + sct + "')");
	var d = new Date()
	var i = new Image();
	i.src = "action/showhide-section-ajax.aspx?s=" + sct + "&a=1&xx=" + d.getMilliseconds();
}

function sbExpand(itm,sct)
{
	sbStartMotion(itm + "b",2,0);
	var obj=document.getElementById(itm + "a");
	obj.setAttribute("href", "javascript:sbCollapse('" + itm + "','" + sct + "')");
	var d = new Date()
	var i = new Image();
	i.src = "action/showhide-section-ajax.aspx?s=" + sct + "&a=2&xx=" + d.getMilliseconds();
}

function sbNextMessage(rt)
{
	var id = sbMotionMsgId;
	var i = rt.indexOf("OKAY");
	if (i == 0)
	{
		var j = rt.indexOf("pJtS");
		var k = rt.indexOf("Xo3aX");
		if (j > 5 && k > j)
		{
			sbMotionMsgId = rt.substr(4,j-4);
			sbMotionMsgTitle = rt.substr(j+4,k-j-4);
			sbMotionMsgDesc = rt.substr(k+5);
			if (id == -1) sbShowMsg();
		}
	}
}

function sbShowMsg()
{
	if (sbMotionMsgId <= 0) return;
	if (document.getElementById("mtnm" + sbMotionMsgId + "b")) return;
	var e_div = document.getElementById("newmsgs");
	if (e_div)
	{
		var n_div = document.createElement("div");
		n_div.className="motion";
		n_div.id="mtnm" + sbMotionMsgId + "b";
		
		var m_div = document.createElement("div");
		m_div.className="article";

		var n_h2 = document.createElement("h2");
		var n_a = document.createElement("a");
		n_a.setAttribute("href", "messages.aspx?msg=" + sbMotionMsgId);
		n_a.appendChild(document.createTextNode(sbMotionMsgTitle));
		n_h2.appendChild(n_a);
		m_div.appendChild(n_h2);
		
		var n_p = document.createElement("p");
		n_p.appendChild(document.createTextNode(sbMotionMsgDesc));
		m_div.appendChild(n_p);
		
		var n_a = document.createElement("a");
		n_a.setAttribute("href", "javascript:sbMessage('" + sbMotionMsgId + "')");
		n_a.className="remove";
		n_a.appendChild(document.createTextNode("Remove [x]"));
		m_div.appendChild(n_a);
		
		n_div.appendChild(m_div);
		e_div.appendChild(n_div);
	}

	sbMotionMsgId=0;
}

function sbCollapse(itm,sct)
{
	sbStartMotion(itm + "b",1,0);
	document.getElementById(itm + "a").setAttribute("href", "javascript:sbExpand('" + itm + "','" + sct + "')");
	document.getElementById(itm + "a").className="toggle-link3";
	var d = new Date()
	var i = new Image();
	i.src = "action/showhide-section-ajax.aspx?s=" + sct + "&a=1&xx=" + d.getMilliseconds();
}

function sbExpand(itm,sct)
{
	sbStartMotion(itm + "b",2,0);
	document.getElementById(itm + "a").setAttribute("href", "javascript:sbCollapse('" + itm + "','" + sct + "')");
	document.getElementById(itm + "a").className="toggle-link2";
	var d = new Date()
	var i = new Image();
	i.src = "action/showhide-section-ajax.aspx?s=" + sct + "&a=2&xx=" + d.getMilliseconds();
}
