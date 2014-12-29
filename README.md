authmodule
==========

It is a nodejs module for token based authentication.

This module uses Json Web Tokens or JWT for authentication.

Configuration:

1) SECRET KEY- Open index.js file and choose the secretkey accordingly. <br />
2) MONGODB URL (Optional) - Specify your mongo host url. MongoDB is used when registration feature is used. <br />
3) COLLECTIONS NAME <br />

Uses: <br />

In your application require('authmodule') <br />

1) authmodule.authenticate - When correct username and password is provided. A token will be issued to the client.<br />
2) authmodule.refresh_token- In case the token is expired. Calling this endpoint with the old token will issue a new token.<br />
3) authmodule.register_user- Calling this endpoint with user details in a JSON object will create an entry in mongodb and issue a token as a response. <br />
4) authmodule.getUserDetails- Get the corresponding details of the user by providing the ID. <br />
