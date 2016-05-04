/**
 * Base framework for OpenDesk. Handles all HTTP requests by sending to various routes
 */

/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , login = require('./routes/login')
  , http = require('http')
  , path = require('path')
  , stylus =  require("stylus")
  , nib =     require("nib")
  , morgan = require("morgan")
  , bodyParser = require("body-parser")
  , methodOverride = require("method-override")
  , errorHandler = require("errorhandler")
  , passport = require("passport")
  , session = require('express-session')
  , yesFeedback = require('./routes/yesFeedback')
  , noFeedback = require('./routes/noFeedback')
  , thankyou = require('./routes/thankyou')
;

// Initialize express
var app = express();
// .. and our app
init_app(app);

// When we get a request for {app}/ we should call routes/index.js
app.get('/', routes.do_work);
// when we get a request for {app/login} we should call routes/login.js
app.get('/login', login.do_work);
app.get('/logout', login.logout);
app.get('/yesFeedback', yesFeedback.do_work);
app.get('/noFeedback', noFeedback.do_work);
app.get('/thankyou', thankyou.do_work);

// Listen on the port we specify
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

///////////////////
// This function compiles the stylus CSS files, etc.
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

//////
// This is app initialization code
function init_app() {
	// all environments
	app.set('port', process.env.PORT || 8080);
	
	// Use Jade to do views
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	// Set the express logger: log to the console in dev mode
	app.use(morgan("dev"));
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());
	// Use Stylus, which compiles .styl --> CSS
	app.use(stylus.middleware(
	  { src: __dirname + '/public'
	  , compile: compile
	  }
	));
	app.use(express.static(path.join(__dirname, 'public')));
	//saves the user session
	app.use(session({
  		secret: 'allyourbasearebelongtous',
  		resave: false,
  		saveUninitialized: true
	}));
	// development only
	if ('development' == app.get('env')) {
	  app.use(errorHandler());
	}

}