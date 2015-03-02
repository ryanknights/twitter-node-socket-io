"use strict";

var express = require('express'),
	app     = express(),
	port    = process.env.PORT || 5000,
	server  = app.listen(port),
	io      = require('socket.io').listen(server);

var Twit = require('twit');

var T = new Twit(
{
    consumer_key:         'jNPS3iRWmCaK9Ds2UFBjDqCZk',
    consumer_secret:      '9Mwj3VzPS9cjH0HzK83vPHTfnoLqPDW14XyhHFhYFXDDEjGfYl',
    access_token:         '581168903-0toGoNmEvbtYpNHs3nq7DgJTN7l2sYZbT8Aaggkq',
    access_token_secret:  'IJSzAVfZMGiHl83Ih55FkZNSWs8UMrGib4i90m64dzU8U'
});

app.use(express.static(__dirname + '/public'));

//Setup socket.io functions
require('./app/routes/socket.js')(io, T);

app.use('/', require('./app/routes/default'));

console.log('App listening on port ' + port);

exports = module.exports = app;