NodeList.prototype.toArray = function(){
  var ary = [];
  for(var i=0, len = this.length; i < len; i++){
    ary.push(this[i]);
  }
  return ary;
};

var Crak = Crak || {};

Crak = function(callback,options){
    'use strict';
    var els = document.querySelectorAll('[data-ctype]');
    this.callback = callback || this.log;
    this.pixel = this.createPixel();
    this.counter = 0;

    Array.prototype.forEach.call(els, function(el, i, nodeList){
      //console.log(el, i, nodeList);
      this.getType(el);
    }.bind(this));
}

Crak.prototype = {
  getType: function(el){
    var params = el.getAttribute('data-cparams');
    switch(el.getAttribute('data-ctype')){
      case 'click':
        this.trackClick(el, params);
      break;
      case 'hover':
        this.trackHover(params);
      break;
      default:
        return;
      break;
    };
  }
, trackClick: function(el,params){
    $(el).click(function(e){
      e.stopPropagation();
      this.firePixel(params,el);
      return false;
    }.bind(this));
  }
, trackHover: function(el,params){
    $(el).click(function(e){
      e.stopPropagation();
      this.firePixel(params,el);
    }.bind(this));
  }
, log: function(log,el){
    console.log(log,el);
    //document.location = el.href;
  }
, firePixel: function(params,el){
    this.pixel.src = './images/crak.png?page='+document.location.href+'&' + $.param(JSON.parse(params)) + '&' + this.counter;
    this.counter++;
    this.int = setInterval(function(){
      if (!this.pixel.complete){
        return false;
      }
      if (typeof this.pixel.naturalWidth !="undefined" && this.pixel.naturalWidth == 0){
        return false;
      }
      clearInterval(this.int);
      this.callback(params,el);
      return true;
    }.bind(this),100);
  }
, createPixel: function(){
    var pixel = new Image();
    pixel.src = './images/crak.png?type=load&page='+document.location.href;
    return pixel;
  }
}
