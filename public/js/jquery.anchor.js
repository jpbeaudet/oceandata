/**
 * Author Jean-Philippe Beaudet@S3R3NITY
 * 
 * jquery.arrowmoving.js - https://github.com/jpbeaudet/
 * jQuery plugin to move from anchor to anchor in anyhtml page with up/down arrows
 * 
 * Copyright (C) 2017 Jean-Philippe Beaudet
 * License GNU 3.0
 * Version: 1.0
 * Dependencies : jQuery
 */
 
/*!
 * Plugin start
 */
 
(function ( $ ) {
/*!
 * Globals
 */
var _tag = "anchor"
var _status = 0 
var __dirname = cleanUrl(window.location.href) 

/*!
 * Methods
 */
 
 /*!
 * cleanUrl(url)
 * @param {string} url : url to cleanup if #focus tags
 * @return {string} url: cleaned url
 * 
 */
function cleanUrl(url){
	url = url.slice( 0, url.indexOf('#') );
	return url
}
/*!
 * getTarget()
 * @param {object} options : {tag: <tag>} 
 * @return {object} this : chainable
 * 
 */

 function getTarget(tags, status, action){
	 //console.log("getTarget action: " +action);
	 //console.log("getTarget status: " +status);
	 if (action== "next"){
		var nextTarget = tags[0][1]
		for (var i = 0; i < tags.length; i++) {
			 if(tags[i][0] >status){
				nextTarget = tags[i][1]
				_status = tags[i][0]
				//console.log("getTarget status end: " +_status);
				return '#'+nextTarget
			 }
		}
		//console.log("getTarget status end: " +_status);
		_status = tags[0][0]
		return '#'+nextTarget
	}else if(action== "previous"){
		var nextTarget = tags[0][1]
		for (var i = tags.length-1; i >=0; i--) {
			 if(tags[i][0] < status){
				nextTarget = tags[i][1]
				_status = tags[i][0]
				//console.log("getTarget status end: " +_status);
				return '#'+nextTarget
			 }
		}
		_status = tags[0][0]
		//console.log("getTarget status end: " +_status);
		return '#'+nextTarget
	}
 }
/*!
 * $.next(tags, status)
 * @param {array} tags : array of anchor tag to scroll from 
 * @param {int} status : last tags index that was focused 
 * @return {object} this : chainable
 * 
 */
	$.fn.nextTag = function(tags, status) {
		//console.log("$.fn.nextTag " );
		var target = getTarget(tags, status, "next")
		//console.log("$.fn.nextTag target: "+target);
		$(target).focus();
		location.hash = target
		
		return this;
		};
/*!
 * $.previous(tags, status)
 * @param {array} tags : array of anchor tag to scroll from 
 * @param {int} status : last tags index that was focused 
 * @return {object} this : chainable
 * 
 */
	$.fn.previousTag = function(tags, status) {
		//console.log("$.fn.previousTag " );
		var target = getTarget(tags, status, "previous")
		//console.log("$.fn.previousTag target: "+target);
		$(target).focus();
		location.hash = target
		
		return this;
		};
	
/*!
 * getAnchors(tag)
 * List all anchors and return in array
 * 
 * @param {string} or {array} tag: tag(s) to be listed as anchors
 * @return {object} list : list= [ [index, id],[index, id] ]
 * 
 */
	function getAnchors(tag){
		var list =[]
		var tags =[]
		if (typeof(tag) == "string"){
			tags.push(tag)
		}else if (typeof(tag) == "array"){
			tags =tag
		}
		
		$( "*" ).each(function( index ) {
			//console.log("listing... elements: " + $(this).attr("class"));
			for (var i = 0; i < tags.length; i++) { 
				//console.log("listing... tags: " + tags[i]);
				//console.log("listing... id: " + $(this).attr("id")+' class: '+$(this).attr("class"));
				if ($(this).is(tags[i])){
					//console.log("listing... match: " + tags[i]+' index: '+index);
					list.push([ index, $(this).attr("id")])
				}
			}
		})
		return list
	}
	
/*!
 * Populate the anchor list 
 * 
 */
	var _tags = getAnchors(_tag)
	//console.log("Tags were collected tags: " + _tags);
/*! 
 * Fetch all key strokes to catch up,down,rigth,left, with keyborads and keypad
 * keypad
 */
	$("*").on("keypress", function(e){
		if (e.which !== 0) {
			//console.log("Character was typed. It was: " + String.fromCharCode(e.which));
			switch(String.fromCharCode(e.which) ){
				case "4": // left
				//console.log("Character was typed. It was: left" );
				$('*').previousTag(_tags, _status)
				e.preventDefault(); // prevent the default action (scroll / move caret)
				break;

				case "8": // up
				//console.log("Character was typed. It was: up" );
				$('*').previousTag(_tags, _status)
				e.preventDefault(); // prevent the default action (scroll / move caret)
				break;

				case "6": // right
				//console.log("Character was typed. It was: right" );
				$('*').nextTag(_tags, _status)
				e.preventDefault(); // prevent the default action (scroll / move caret)
				break;

				case "2": // down
				//console.log("Character was typed. It was: Down" );
				$('*').nextTag(_tags, _status)
				e.preventDefault(); // prevent the default action (scroll / move caret)
				break;
		
				default: return; // exit this handler for other keys
			}
		}
	});
/*! 
 * Fetch all key strokes to catch up,down,rigth,left, with keyborads and keypad
 * keyboard
 */
	$(document).keydown(function(e) {
		switch(e.which) {
			case 37: // left
			//console.log("Character was typed. It was: left" );
			$('*').previousTag(_tags, _status)
			break;

			case 38: // up
			$('*').previousTag(_tags, _status)
			//console.log("Character was typed. It was: up" );
			break;

			case 39: // right
			$('*').nextTag(_tags, _status)
			//console.log("Character was typed. It was: right" );
			break;

			case 40: // down
			$('*').nextTag(_tags, _status)
			//console.log("Character was typed. It was: Down" );
			break;

			default: return; // exit this handler for other keys
		}
		e.preventDefault(); // prevent the default action (scroll / move caret)
	});
/*!
 * Plugin end
 */
}( jQuery ));
