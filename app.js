// Required modules
var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
var path = require('path');
var compress = require('compression');
var databaseUri = process.env.DATABASE_URI || 'mongodb://sankalp:password@ds123614.mlab.com:23614/thanos-1'

var api = new ParseServer({
  databaseURI: databaseUri,
  appId: process.env.APP_ID || 'thanostestappid',
  masterKey: process.env.MASTER_KEY || 'thanostestmasterkey', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://ec2-35-154-123-98.ap-south-1.compute.amazonaws.com/thanos',  // Don't forget to change to https if needed
  javascriptKey: process.env.JAVASCRIPT_KEY || "thanostestjskey",
  restAPIKey : process.env.RESTAPI_KEY || "thanostestrestapikey"
});
var dashboard = new ParseDashboard({
  "apps": [
    {
      "serverURL": process.env.SERVER_URL || 'ttp://ec2-35-154-123-98.ap-south-1.compute.amazonaws.com/thanos',
      "appId": process.env.APP_ID || 'thanostestappid',
      "masterKey": process.env.MASTER_KEY || 'thanostestmasterkey',
      "appName": "thanos"
    }
  ],
  "users": [
    {
      "user": process.env.DASHBOARD_USERNAME || 'thanosuser',
      "pass": process.env.DASHBOARD_PASSWORD || 'thanos'
    }
  ]
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

app.use(compress({threshold:0}))


// Serve the Parse API on the /thanos URL prefix
// Serve the Parse dashboard on /dashboard URL prefix
var appServerMountPath = process.env.PARSE_MOUNT || '/thanos';
var webServerMountPath = process.env.PARSE_WEB_MOUNT || '/dashboard';
app.use(appServerMountPath, api);
app.use(webServerMountPath, dashboard);

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('thanos running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
