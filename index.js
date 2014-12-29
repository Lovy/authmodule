var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var MongoClient = require('mongodb').MongoClient
, assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

//Secret
var secret = "yoursecrettoken";
//Connection URL
var url = 'mongodb://localhost:27017/mydb';
//Collection
var mycollection ='users'

var connect = function(callback){
	MongoClient.connect(url, function(err, db) {
		  assert.equal(null, err);
		  console.log("Connected correctly to server");
		  callback(db);
	});
};

var insertUser = function(db, data) {
	  // Get the documents collection
	  var collection = db.collection(mycollection);
	  // Insert user data
	  collection.insert(data, function(err, result) {
	    assert.equal(err, null);
	    console.log(result[0]._id);
	    db.close();
	  });
};

var register_user = function(req,res){
	var data = JSON.parse(req.body.data);
	var mongoconnection = connect(function(db){
		insertUser(db,data);
	});
	// We are sending the profile inside the token
	var token = jwt.sign(data,secret, { expiresInMinutes: 60*5 });
	res.json({ token: token });
};



var findUser = function(db, id, callback) {
	  // Get the documents collection
	  var collection = db.collection('users');
	  var _id = new ObjectId(id);
	  collection.find({_id:_id}).toArray(function(err, result) {
	    assert.equal(err, null);
	    db.close();
	    callback(result);
	  });
};

var getUserDetails = function(req,res){
	var id = req.params.userid;
	var mongoconnection = connect(function(db){
		findUser(db,id,function(result){
			console.log(result);
			res.end();
		});
	});
}

var authenticate = function (req, res) {
	  //TODO validate req.body.username and req.body.password
	  //if is invalid, return 401
	  if (!(req.body.username === 'john' && req.body.password === 'foo')) {
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
	  var token = jwt.sign(profile, secret, { expiresInMinutes: 60*5 });

	  res.json({ token: token });
	};
	

var verify = expressJwt({secret: secret})

var refresh_token = function (req, res) {
  // verify the existing token
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
	refresh_token:refresh_token,
	register_user:register_user,
	getUserDetails:getUserDetails
};