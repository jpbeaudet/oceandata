// Author: Jean-Philippe Beaudet @ S3R3NITY Technology 
//
// Oceandata
// Version : 0.0.1
// copyrigths : OcenaData
// License: 
//
// =====================================================
var mongoose = require('mongoose');
var fs = require('fs')


exports.en= function (req, res) {
	var lang = "en"
	res.redirect("/?lang="+lang)
}

exports.fr = function (req, res) {
	var lang = "fr"
	res.redirect("/?lang="+lang)
}

exports.index = function (req, res) {
	var lang = req.query.lang || "en";
	var username = "Not logged in";
	var isAlreadyLoggedin = false;
	// if the user is logged in 
	if(req.user) {
		username = req.user.username;
		isAlreadyLoggedin = true;
	}
	var data = {
		lang: lang,
		title: "OceanData",
		username: username,
		isAlreadyLoggedin:isAlreadyLoggedin
	};
	res.render('index/index_'+lang, data);
};
