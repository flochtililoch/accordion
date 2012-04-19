"use strict";

// BOOTSTRAP
window.onload = function() {
  
  var accordions = document.getElementsByClassName('accordion');
  for (var i = 0; i < accordions.length; i++) {
    var acc = new Accordion(accordions[i]);
  }
  
}

// ACCORDION CLASSES
var Accordion = function(elt) {
  var self = this;
  self.elt = elt;
  self.items = [];
  self.visibileItem = null;
  
  var headings = elt.getElementsByClassName('heading'),
      items = elt.getElementsByClassName('content');
  
  for (var i = 0; i < items.length; i++) {
    self.items.push(new AccordionItem(self, headings[i], items[i]));
  }
};

Accordion.prototype.toggle = function(item, e) {
  if(this.visibleItem !== item) {
    this.visibleItem.toggle(e);
    item.toggle(e);
    $.fireEvent(item.ref, 'open');
  }
};

var AccordionItem = function(parent, ref, elt) {
  var self = this,
      dim = $.dimension(elt, 'Height');
  
  self.parent = parent;
  self.parent.visibleItem = dim.visible ? this : self.parent.visibleItem;
  self.ref = ref.getElementsByTagName('a')[0];
  self.elt = elt;
  
  self.styles = {
    height : parseInt(dim.value, 10),
    paddingBottom: parseInt($.getStyle(self.elt, 'padding-bottom'), 10),
    paddingTop: parseInt($.getStyle(self.elt, 'padding-top'), 10),
  };
  
  $.attachEvent(
    ref,
    'click',
    function(e){
      self.parent.toggle(self, e);
    }
  );
  
  $.attachEvent(
    self.ref,
    'open',
    function(e){
      console.log('laa');
      var request = new $.ajax(self.ref.href, function(response){
        self.elt.innerHTML = Date(response.now);
      });
      request.update(null, 'GET');
      
    }
  );
}

AccordionItem.prototype.toggle = function(event) {
  var self = this;
  var style = self.elt.style;
  event.stopPropagation();
  event.preventDefault();
  
  var content = "foo";

  $.queryString(event.target.href)['ref'];

  var dim = $.dimension(self.elt, 'Height'),
      heightTo = dim.visible ? 0 : self.styles.height,
      heightFrom = dim.visible ? self.styles.height : 0,
      paddingBottomTo = dim.visible ? 0 : self.styles.paddingBottom,
      paddingBottomFrom = dim.visible ? self.styles.paddingBottom : 0,
      paddingTopTo = dim.visible ? 0 : self.styles.paddingTop,
      paddingTopFrom = dim.visible ? self.styles.paddingTop : 0,
      step = dim.visible ? -1 : 1;
  
  // Prior animation, initalize all styles
  style.paddingBottom = paddingBottomFrom + 'px';
  style.paddingTop = paddingTopFrom + 'px';
  style.height = heightFrom + 'px';
  style.paddingBottom = paddingBottomFrom + 'px';
  if(!dim.visible) {
    style.display = 'block';
    self.parent.visibleItem = this;
  }
  
  var animation = setInterval(function() {
    // animate padding bottom first
    if(paddingBottomFrom == paddingBottomTo) {
      // then padding top
      if(paddingTopFrom == paddingTopTo) {
        // finish with height
        if(heightFrom == heightTo) {
          if(dim.visible) {
            style.display = 'none';
          }
          clearInterval(animation);
        } else {
          style.height = heightFrom + 'px';
          heightFrom += step;
        }
      } else {
        style.paddingTop = paddingTopFrom + 'px';
        paddingTopFrom += step;
      }
    } else {
      style.paddingBottom = paddingBottomFrom + 'px';
      paddingBottomFrom += step;
    }
  }, 1, self);
}

// UTILITY CLASS
var $ = {};
$.attachEvent = function(elt, type, delegate) {
  if(elt) {
    if(elt.attachEvent) {
      elt.attachEvent("on" + type, delegate);
    } else if(elt.addEventListener) {
      elt.addEventListener(type, delegate, false);
    } else {
      elt["on" + type] = delegate;
    }
  }
};

$.fireEvent = function(elt, event){
  if(document.createEventObject) {
    var evt = document.createEventObject();
    return elt.fireEvent('on' + event, evt)
  } else {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent(event, true, true );
    return !elt.dispatchEvent(evt);
  }
}

$.queryString = function(s) {
  var p = s.substr(s.indexOf('?') + 1, s.length).split('&'),
      params = {};
  for(var i = 0; i < p.length; i++) {
    var aP = p[i].split('=');
    params[aP[0]] = aP[1];
  }
  return params;
};

$.getStyle = function(elt, styleProp) {
	if (elt.currentStyle) {
	  var y = elt.currentStyle[styleProp];
	} else if(window.getComputedStyle) {
	  var y = document.defaultView.getComputedStyle(elt, null).getPropertyValue(styleProp);
	}
	return y;
};

$.dimension = function(elt, prop) {
  var r = {
    visible: true,
    value: elt['offset' + prop]
  };

  if($.getStyle(elt, 'display') == 'none') {
    elt.style.visibility = 'hidden';
    elt.style.display = 'block';
    r.value = elt['offset' + prop];
    r.visible = false;
    elt.style.visibility = '';
    elt.style.display = '';
  }
  return r;
};

// http://www.hunlock.com/blogs/The_Ultimate_Ajax_Object
$.ajax = function(url, callback) {
  var that=this;      
  this.updating = false;
  this.abort = function() {
    if (that.updating) {
      that.updating=false;
      that.AJAX.abort();
      that.AJAX=null;
    }
  }
  this.update = function(passData,postMethod) { 
    if (that.updating) { return false; }
    that.AJAX = null;                          
    if (window.XMLHttpRequest) {              
      that.AJAX=new XMLHttpRequest();              
    } else {                                  
      that.AJAX=new ActiveXObject("Microsoft.XMLHTTP");
    }                                             
    if (that.AJAX==null) {                             
      return false;                               
    } else {
      that.AJAX.onreadystatechange = function() {  
        if (that.AJAX.readyState==4) {             
          that.updating=false;                
          that.callback(that.AJAX.responseText,that.AJAX.status,that.AJAX.responseXML);        
          that.AJAX=null;                                         
        }                                                      
      }                                                        
      that.updating = new Date();                              
      if (/post/i.test(postMethod)) {
        var uri=urlCall+'?'+that.updating.getTime();
        that.AJAX.open("POST", uri, true);
        that.AJAX.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        that.AJAX.setRequestHeader("Content-Length", passData.length);
        that.AJAX.send(passData);
      } else {
        var uri=urlCall+'?'+passData+'&timestamp='+(that.updating.getTime()); 
        that.AJAX.open("GET", uri, true);  
        that.AJAX.setRequestHeader("X-Requested-With", "XMLHttpRequest");                           
        that.AJAX.send(null);                                         
      }              
      return true;                                             
    }                                                                           
  }
  var urlCall = url;        
  this.callback = callback || function () { };
}