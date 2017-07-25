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

exports.index = function (req, res) {
	var username = "Not logged in";
	var isAlreadyLoggedin = false;
	// if the user is logged in 
	if(req.user) {
		username = req.user.username;
		isAlreadyLoggedin = true;
	}
	var data = {
		title: "OceanData",
		username: username,
		isAlreadyLoggedin:isAlreadyLoggedin
	};
	res.render('index/index', data);
};
