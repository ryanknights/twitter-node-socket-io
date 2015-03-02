"use strict"

var express = require('express');

module.exports = (function (app)
{
	var api = express.Router();

	api.get('/*', function (req, res)
	{
		res.sendfile('./public/index.html');
	})

	return api;

})();