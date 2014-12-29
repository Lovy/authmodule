var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var express = require('express');
var bodyParser = require('body-parser');

var authenticate = function (req, res) {
	  //TODO validate req.body.username and req.body.password
	  //if is invalid, return 401
	  if (!(req.body.username === 'john.doe' && req.body.password === 'foobar')) {
	    res.status(401).send('Wrong user or password');
	    return;
	  }

	  var profile = {
	    first_name: 'John',
	    last_name: 'Doe',
	    email: 'john@doe.com',
	    id: 123
	  };

	  // We are sending the profile inside the token
	  var token = jwt.sign(profile, "thisisasecrettokenformentozafuckers", { expiresInMinutes: 60*5 });

	  res.json({ token: token });
	};
	
var secret = "thisisasecrettokenformentozafuckers";
var verify = expressJwt({secret: secret})

var refresh_token = function (req, res) {
  // verify the existing token
	var secret = "thisisasecrettokenformentozafuckers";
	console.log(req.headers);
	var profile;
  jwt.verify(req.body.token, secret , null , function(err,res){
	  profile=res;
  });
  //console.log(profile);
  // if more than 14 days old, force login
  /*if (profile.original_iat - new Date() > 14) { // iat == issued at
    return res.send(401); // re-logging
  }*/

  // check if the user still exists or if authorization hasn't been revoked
  //if (!valid) return res.send(401); // re-logging

  // issue a new token
  var refreshed_token = jwt.sign(profile, secret, { expiresInMinutes: 60*5 });
  res.json({ refreshed_token: refreshed_token });
};

module.exports = {
	authenticate:authenticate,
	verify:verify,
	refresh_token:refresh_token
};