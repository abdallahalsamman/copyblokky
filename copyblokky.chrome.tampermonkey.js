// ==UserScript==
// @name         Sublime Column Selection
// @version      0.1
// @description  try to take over the world!
// @author       Evex
// @match        *://*/*
// ==/UserScript==

(function() {
    'use strict';

    var startPos, stopPos, startPosFinal, stopPosFinal;
    var fontSize, target_elem, sel_pos, start, end, range, selected_text;

    var text = "";
    var sel = window.getSelection();

    var sel_underlay = document.createElement('div');
    sel_underlay.style.backgroundColor = "#b1d7fe";
    sel_underlay.style.position = "fixed";
    sel_underlay.id = "sel";

  var copy_div = document.createElement('div');
    copy_div.style.display = "hidden";
    copy_div.id = "copy";

    var body = document.getElementsByTagName('body')[0];
    body.appendChild(copy_div);
    body.appendChild(sel_underlay);

    var onMouseMove = function(e) {
      if (startPos.x && startPos.y) {
        sel_pos = {
          x: Math.min(e.x, startPos.x),
          y: Math.min(e.y, startPos.y),
          height: Math.abs(e.y - startPos.y),
          width: Math.abs(e.x - startPos.x)
        };
        sel_underlay.style.display = "initial";
        sel_underlay.style.height = sel_pos.height;
        sel_underlay.style.width = sel_pos.width;
        sel_underlay.style.top = sel_pos.y;
        sel_underlay.style.left = sel_pos.x;
        sel_underlay.setAttribute("style", `background-color:#b1d7fe;position:fixed;z-index:999999;opacity:0.7;display:block;width:${sel_pos.width}px;height:${sel_pos.height}px;top:${sel_pos.y}px;left:${sel_pos.x}px;`);
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
        sel_underlay.style.display = "none";
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