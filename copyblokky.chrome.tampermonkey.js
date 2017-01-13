// ==UserScript==
// @name         Sublime Text Column Selection
// @version      0.1
// @description  try to take over the world!
// @author       Abdullah Samman
// @match        *://*/*
// ==/UserScript==

(function() {
    'use strict';

    var startPos, stopPos, startPosFinal, stopPosFinal;
    var fontSize, target_elem, sel_pos, start, end, range, selected_text;

    var text = "";
    var sel = window.getSelection();

    function make_element(tagname="div", style=""){
      elem = document.createElement(tagname);
      elem.setAttribute(`style: ${style}`)
      return elem;
    }

    function init_selection_overlay(){
      var selection_overlay = document.createElement('div');
      selection_overlay.id = "sel";
    }
    
  	function init_copy_div(){
      var copy_div = document.createElement('div');
      copy_div.style.display = "hidden";
      copy_div.id = "copy";
    }

    function init(){
      var body = document.getElementsByTagName('body')[0];
      body.appendChild(copy_div);
      body.appendChild(selection_overlay);
    }

    function set_and_make_selection_overlay_style(sel_pos){
      selection_overlay.style.display = "initial";
      selection_overlay.style.height = sel_pos.height;
      selection_overlay.style.width = sel_pos.width;
      selection_overlay.style.top = sel_pos.y;
      selection_overlay.style.left = sel_pos.x;
      return `background-color:#b1d7fe;position:fixed;z-index:999999;opacity:0.7;display:block;width:${sel_pos.width}px;height:${sel_pos.height}px;top:${sel_pos.y}px;left:${sel_pos.x}px;`;
    }


    var onMouseMove = function(e) {
      if (startPos.x && startPos.y) {
      	sel_pos = {
      		x: Math.min(e.x, startPos.x),
      		y: Math.min(e.y, startPos.y),
      		height: Math.abs(e.y - startPos.y),
      		width: Math.abs(e.x - startPos.x)
      	};
        selection_overlay.setAttribute("style", set_and_make_selection_overlay_style(sel_pos));
      }
    };

    var onMouseUp = function(e) {
      stopPos = {
        x: e.x,
        y: e.y
      };

      if (startPos && stopPos && startPos.x != stopPos.x && startPos.y != stopPos.y) {
  		startPosFinal = {
  			x: Math.min(startPos.x, stopPos.x),
  			y: Math.min(startPos.y, stopPos.y)
  		};
  		stopPosFinal = {
  			x: Math.max(startPos.x, stopPos.x),
  			y: Math.max(startPos.y, stopPos.y)
  		};
        text = "";
        selection_overlay.style.display = "none";
        target_elem = document.elementFromPoint(startPosFinal.x, startPosFinal.y);
        fontSize = parseFloat(
        	window.getComputedStyle(target_elem).getPropertyValue('font-size'));
        for (var i = startPosFinal.y + (fontSize/2); i <= stopPosFinal.y; i = i + fontSize) {
		  target_elem = document.elementFromPoint(startPosFinal.x, i);
          start = document.caretRangeFromPoint(startPosFinal.x, i);
          end = document.caretRangeFromPoint(stopPosFinal.x, i);
          range = document.createRange();
          range.setStart(start.startContainer, start.startOffset);
          range.setEnd(end.startContainer, end.startOffset);
          sel.removeAllRanges();
          sel.addRange(range);
          selected_text = sel.toString();
          if (selected_text){
	          text += selected_text + "<br>";
          }
          fontSize = parseFloat(
        	window.getComputedStyle(target_elem)
	        	.getPropertyValue('font-size'));
        }
        sel.removeAllRanges();
        copy_div.innerHTML = text;
        range = document.createRange();
        range.selectNode(copy_div);
        sel.addRange(range);
        document.execCommand('copy');
        copy_div.innerHTML = "";
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    var onMouseDown = function(e) {
      if (e.altKey) {
        e.preventDefault();
        startPos = {
          x: e.x,
          y: e.y
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      }
    };


    window.addEventListener('mousedown', onMouseDown);
})();