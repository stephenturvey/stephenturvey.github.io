// $(document).ready(function(){$(".transcript").hide();$('<p><a href="#" class="toggle">Show transcript</a><p/>').appendTo("div.clip");$('a.toggle').click(function(){$(this).text($(this).text()=='Show transcript'?'Hide transcript':'Show transcript');$(this).parent().parent().next().toggle();return false;$(this).html(text)})});

window.onload = function(){
  var style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  var styles = document.createTextNode('.transcript-hide {display: none;} .transcript-show {display: block;}');
  style.appendChild(styles);
  var head = document.getElementsByTagName('head')[0].appendChild(style);
  var divs = document.getElementsByTagName('div');
  for (d in divs) {
    if(divs[d].className == 'ou-transcript') {
      divs[d].className = divs[d].className + ' transcript-hide';
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
    if(classes[c] == 'transcript-hide') {
      delete classes[c];
      classes.push('transcript-show');
      break;
    } else if(classes[c] == 'transcript-show') {
      delete classes[c];
      classes.push('transcript-hide');
      break;
    }
  }
  transcript.className = classes.join(' ');
}