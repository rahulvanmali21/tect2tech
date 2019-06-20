const express = require("express");
const mongoose = require("mongoose");
const expressValidator = require("express-validator");
const passport = require("passport");
const session  = require("express-session");
const path = require("path");
const flash = require('connect-flash');
const hbs = require("hbs");

// Routes
const indexRoute = require("./routes/index");
const userAuthRoute = require("./routes/user");
const taskRoute = require("./routes/task");
const codeApi = require("./routes/codeApi");

// Import Models
global.User = require('./models/User');
global.Task = require('./models/Task');

var fs = require('fs');

var partialsDir = __dirname + '/views/partials';

var filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});


// passport config
const config = require("./config/config");
require("./config/passport")(passport);
const app = express();

// connect to mongoDB
mongoose.connect(config.database,{useNewUrlParser:true})
    .then(()=> console.log("MongoDB connected"))
    .catch(err => console.log(err));

// set Handlerbasr template engine
app.set("views",path.join(__dirname,"views"))
app.set("view engine","hbs");

// express body parser
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// express sessions
app.use(session({
    secret:"secret",
    resave:true,
    saveUninitialized:true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// serve static files
app.use(express.static(path.join(__dirname,"public")));
app.use(expressValidator())

app.use(function(req, res, next) {
    if (req.isAuthenticated()) {
      res.locals.user = req.user;
    }
    next();
  });

// Load Routes
app.use("/",indexRoute);
app.use("/account",userAuthRoute);
app.use("/task",taskRoute);
app.use("/codeApi",codeApi);

const port = process.env.PORT || 5000
let server = app.listen(port,()=>{
    console.log(`server is up on port ${port}`)
});
require("./socket_server")(server);