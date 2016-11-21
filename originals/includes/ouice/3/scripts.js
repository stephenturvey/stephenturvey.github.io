// 2012.05.01 gdc53

function addLoadEvent(func) {
var oldonload = window.onload; 
if (typeof window.onload != 'function') {
    window.onload = func;
  } else {           
    window.onload = function() { 
      oldonload();
      func();      
    }
  }
}
var fn = function(){
  var divs = document.getElementsByTagName('div');
  for (d in divs) {
    if(divs[d].className == 'ou-transcript') {
      divs[d].className = divs[d].className + ' ou-transcript-hide';
    } else if(divs[d].className == 'ou-clip') {
      var p = document.createElement('p');
      var a = document.createElement('a');
      var t = document.createTextNode('Show transcript');
      a.setAttribute('href', '#');
      a.className = 'ou-toggle';
      a.onclick = function(){toggleTranscript(this.parentNode.parentNode); if(this.childNodes[0].nodeValue == 'Show transcript') {this.childNodes[0].nodeValue = 'Hide transcript'} else {this.childNodes[0].nodeValue = 'Show transcript'} return false};
      a.appendChild(t);
      p.appendChild(a);
      divs[d].appendChild(p);
    }
  }
};
function toggleTranscript(element) {
  var transcript = element.nextSibling;
  if(!transcript.className) {
    transcript = transcript.nextSibling;
  }
  var classes = transcript.className.split(' ');
  for(c in classes) {
    if(classes[c] == 'ou-transcript-hide') {
      delete classes[c];
      classes.push('ou-transcript-show');
      break;
    } else if(classes[c] == 'ou-transcript-show') {
      delete classes[c];
      classes.push('ou-transcript-hide');
      break;
    }
  }
  transcript.className = classes.join(' ');
}
addLoadEvent(fn);