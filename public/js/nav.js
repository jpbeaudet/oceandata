/**
 * nav.js - https://github.com/jpbeaudet/nav.js
 * Browser based serach engine used to handle and generate and managne a file structure mapping (map.js) and inbox structure file (inbox.js)
 * nav.js will used browser side encryption decryption.
 * 
 * Copyright (C) 2017 Jean-Philippe Beaudet
 * Copyright (C) 2017 Virtuba
 * 
 * 
 */

/*!
 * nav.js
 * 
 * Copyright (C) 2017 Jean-Philippe Beaudet
 * Copyright (C) 2017 Virtuba
 */

$(document).ready(function(){
	// load elasticlunrjs within the confine of this script
	$.getScript( "/js/elasticlunr.js" )
	.done(function( script, textStatus ) {
		console.log( "elasticlunr.js loading: "+ textStatus );
		
/*!
 * Setup elasticlunr Configurations
 * 
 * @param {object} config : user 
 * @param {array} fields : array of fields value
 * 
 */
	elasticlunr.Configuration = function (config, fields) {
		var config = config || '';
		if (fields == undefined || fields == null) {
			throw new Error('fields should not be null');
		}
		this.config = {};
		var userConfig;
		try {
			userConfig = JSON.parse(config);
			this.buildUserConfig(userConfig, fields);
		} catch (error) {
			elasticlunr.utils.warn('user configuration parse failed, will use default configuration');
			this.buildDefaultConfig(fields);
		}
	};

	elasticlunr.Configuration.prototype.buildDefaultConfig = function (fields) {
		this.reset();
		fields.forEach(function (field) {
			this.config[field] = {
				boost: 1,
				bool: "OR",
				expand: false
			};
	}, this);
};

	elasticlunr.Configuration.prototype.reset = function () {
		this.config = {};
	};
	elasticlunr.Configuration.prototype.get = function () {
		return this.config;
	};
  /*!
 * Main nav object constructor && prototypes
 * This constructor will build the current navigation object
 * 
 * @param {String} map : stringified version of map.json
 * @param {String} inbox : stringified version of inbox.json
 * @type {constructor}
 * 
 * Example: map.json
 * {
	files: [
		{
			id: 1,
			filename: "jp.txt",
			type: "txt",
			path: "main/1/jp.txt",
			filehash: "hgdjhfjhfdjhgkjh6763476",
			author: "Jean-philippe beaudet",
			creation_date: "2016-01-01",
			assigned_to:"Jean-philippe beaudet ; alice samson"
		},
		{
			id:2,
			filename: "test.txt",
			type: "txt",
			path: "main/1/test.txt",
			filehash: "hgdjhfjhfdjhgkjh6763476",
			author: "Testosterone",
			creation_date: "2017-01-01",
			assigned_to:""
		}
		]
	}
 * 
 * Example: inbox.json
 * 
 * {
	msg: [
		{
			id: 1,
			read: "true",
			subject: "hello alice 1",
			from: "bob@virtuba",
			to: "alice@virtuba",
			filehash: "hgdjhfjff88^%778%",
			author: "Jean-philippe beaudet",
			creation_date: "2016-01-01",
			assigned_to: "Jean-philippe beaudet",
			has_file: "false"
		},
		{
			id: 2,
			read: "false",
			subject: "hello alica",
			from: "bob@virtuba",
			to: "alice@virtuba",
			filehash: "hgdjhfjff88^%778%",
			author: "Jean-philippe beaudet",
			creation_date: "2016-01-01",
			assigned_to: "Jean-philippe beaudet",
			has_file: "test.txt ; jp.txt"
		}
		]
	}
 */

	function nav(map, inbox){
		this.map ={
			source: map,
			sections: ["legal", "insurance"],
			index : elasticlunr(function () {
				this.addField('path');
				this.addField('type');
				this.addField('author');
				this.addField('section');
				this.addField('creation_date');
				this.addField('assigned_to');
				this.addField('filename');
				this.addField('filehash');
				this.setRef('id');
			})
		},
		this.inbox ={
			source: inbox,
			index : elasticlunr(function () {
				this.addField('subject');
				this.addField('from');
				this.addField('to');
				this.addField('read');
				this.addField('isNew');
				this.addField('filehash');
				this.addField('author');
				this.addField('creation_date');
				this.addField('has_file');
				this.addField('assigned_to');
				this.setRef('id');
			})
		}
	}
/*!
 * nav.populate()
 * populate each index to built the browser-side query object
 * @param {this}  : Itself
 * @type {prototypes}
 */
	nav.prototype.populate = function(){
		for (var i = 0; i < this.map.source.files.length; i++) { 
			console.log("map populate: "+JSON.stringify(this.map.source.files[i]))
			this.map.index.addDoc(this.map.source.files[i])
		}
		for (var i = 0; i < this.inbox.source.msg.length; i++) { 
			console.log("inbox populate: "+JSON.stringify(this.inbox.source.msg[i]))
			this.inbox.index.addDoc(this.inbox.source.msg[i])
		}
		return true
	}

	var nav_test = new nav(map, inbox)
	//var x = nav_test.inbox.index
	//console.log("nav_test.map.index= "+JSON.stringify(x))
	var map_config = new elasticlunr.Configuration(null,["path","type","author","creation_date","assigned_to","filename","filehash"])
	var inbox_config = new elasticlunr.Configuration(null, ["subject","from","to","filehash","author","creation_date","has_file","assigned_to"])
	nav_test.populate()
	// Visual testing
	$('#map').text(JSON.stringify(nav_test.map.source))
	$('#inbox').text(JSON.stringify(nav_test.inbox.source))
/*!
 * nav.search()
 * populate each index to built the browser-side query object
 * @param {this}  : Itself
 * @param {string} query : string that represent the query parameter
 * @param {object} opts : all lunrjs query format is supported via options.query (leaving space for other needed options later)
 * @type {prototypes}
 */
	nav.prototype.search = function(query, opts){
		var options = opts || {selector:"map"}
		if (!options.query){
			options.query = query
		}
		console.log("nav.prototype.search options: "+JSON.stringify(options))
		return this[options.selector].index.search(options.query);
	}
	// visual testing
	$("#search").submit(function(event){
		event.preventDefault();
		console.log("#search parameters: "+$( "#exampleTextarea" ).val())
		var ret = nav_test.search($( "#exampleTextarea" ).val())
		console.log("#search results: "+ret)
		$("#results").text(JSON.stringify(ret))
	});
	// visual testing
	$("#search_inbox").submit(function(event){
		event.preventDefault();
		console.log("#search parameters: "+$( "#exampleTextarea2" ).val())
		var ret = nav_test.search($( "#exampleTextarea2" ).val(), {selector:"inbox"})
		console.log("#search results: "+ret)
		$("#results2").text(JSON.stringify(ret))
	});
/*! 
 * - load a new nav object : refresh the nav object with current map and inbox decrypted value
 * @param {this}  : Itself
 * @type {prototypes}
 * 
 */
	nav.prototype.refresh = function(){
		nav_test = new nav(map, inbox)
		return nav_test.populate()
	}
	//nav_test.refresh()
	
	
 /*!
 * File system
 *  -- Display --
 * 
 * - jQuery : display folder structure, and navigate into sections
 * - jQuery : display folder content
 * - jQuery : display folder type
 * ( the final html markup will be updated in the virtuba template css environment)
 */
 var sections =[]
 for (var i = 0; i < nav_test.map.sections.length; i++) {
	sections.push('<a href="#" class="folder" name="'+nav_test.map.sections[i]+'"><i class="fa fa-folder fa-lg"></i>&nbsp'+nav_test.map.sections[i]+'</a><br>')
 } 
 $("#sections").html(sections.join(""))
 $(".folder").click(function(){
	var files =[]
	var section = $(this).attr('name')
	$(".folder").each(function(){
		$(this).hide()
		$("#back").show()
	})
	for (var i = 0; i < nav_test.map.source.files.length; i++) {
		console.log("nav_test.map.source.files[i].filename= "+nav_test.map.source.files[i].section)
		console.log("section= "+section)
		if(nav_test.map.source.files[i].section == section){
			console.log("Bing !!!")
			switch(nav_test.map.source.files[i].type){
				case "txt":
					files.push('<a href="#" id="file" name="'+nav_test.map.source.files[i].filename+'"><i class="fa fa-file-text fa-lg"></i>&nbsp'+nav_test.map.source.files[i].filename+'</a><br>')
					break;
				case "doc":
					files.push('<a href="#" id="file" name="'+nav_test.map.source.files[i].filename+'"><i class="fa fa-file-word-o fa-lg"></i>&nbsp'+nav_test.map.source.files[i].filename+'</a><br>')
					break;
				case "docx":
					files.push('<a href="#" id="file" name="'+nav_test.map.source.files[i].filename+'"><i class="fa fa-file-word-o fa-lg"></i>&nbsp'+nav_test.map.source.files[i].filename+'</a><br>')
					break;
				case "pdf":
					files.push('<a href="#" id="file" name="'+nav_test.map.source.files[i].filename+'"><i class="fa fa-file-pdf-o fa-lg"></i>&nbsp'+nav_test.map.source.files[i].filename+'</a><br>')
					break;
				case "excel":
					files.push('<a href="#" id="file" name="'+nav_test.map.source.files[i].filename+'"><i class="fa fa-file-ecxel-o fa-lg"></i>&nbsp'+nav_test.map.source.files[i].filename+'</a><br>')
					break;
				case "video":
					files.push('<a href="#" id="file" name="'+nav_test.map.source.files[i].filename+'"><i class="fa fa-file-video-o fa-lg"></i>&nbsp'+nav_test.map.source.files[i].filename+'</a><br>')
					break;
				case "audio":
					files.push('<a href="#" id="file" name="'+nav_test.map.source.files[i].filename+'"><i class="fa fa-file-audio-o fa-lg"></i>&nbsp'+nav_test.map.source.files[i].filename+'</a><br>')
					break;
				case "powerpoint":
					files.push('<a href="#" id="file" name="'+nav_test.map.source.files[i].filename+'"><i class="fa fa-file-powerpoint-o fa-lg"></i>&nbsp'+nav_test.map.source.files[i].filename+'</a><br>')
					break;
				case "archive":
					files.push('<a href="#" id="file" name="'+nav_test.map.source.files[i].filename+'"><i class="fa fa-file-archive-o fa-lg"></i>&nbsp'+nav_test.map.source.files[i].filename+'</a><br>')
					break;
				default:
					files.push('<a href="#" id="folder" name="'+nav_test.map.source.files[i].filename+'"><i class="fa fa-folder fa-lg"></i>&nbsp'+nav_test.map.source.files[i].filename+'</a><br>')
				}
			
		}
	}
	$("#sections").html(files.join(""))
});
 $("#back").click(function(){
	$("#back").hide()
	var sections =[]
	for (var i = 0; i < nav_test.map.sections.length; i++) {
		sections.push('<a href="#" class="folder" name="'+nav_test.map.sections[i]+'"><i class="fa fa-folder fa-lg"></i>&nbsp'+nav_test.map.sections[i]+'</a><br>')
	} 
 $("#sections").html(sections.join(""))
 });
 
 /*!
 * -- Navigation --
 * - create/delete folder
 * - upload files
 * -- Commands --
 * - add commands( read and downlaod will trigger a send() action in the web server and willexpect a encrypted return value with a new map and inbox
 * - add/edit/remove meta-data (assign file, author, ect)
 */
 
 
  /*!
 * Inbox
 *  -- Display --
 * - jQuery : display msg
 * - jQuery : display folder content
 * - jQuery : display folder type
 * -- Navigation --
 * - create/edit/delete msg
 * - get current msg
 * -- Commands --
 * - add commands
 * - add/edit/remove msg meta-data 
 */
 
  /*!
   * --  Finally --
 * Post actions
 * - post map.json
 * - post inbox.json
 * - connect to encryption module
 * 
 */
	})// end of elasticlunrjs
	.fail(function( jqxhr, settings, exception ) {
		console.log("elasticlunr.js loading: "+exception )
	});
})

