import * as fs from 'fs';
import * as http from "http";
import * as url from "url";
import * as express from "express";
import * as bodyParser from "body-parser";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");

var app = express();

// Configuration

app.set('views', __dirname);
app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

// serve /public on '/'

var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  app.use(errorHandler());
}

//app.use( '/api', apiRouter );

app.use(express.static(__dirname + '/../../public'));

let port = 8080;
app.listen(port, function() {
  console.log("Demo Express server listening on port %d in %s mode", port, app.settings.env);
});

export var App = app;
