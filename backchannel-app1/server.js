const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const logger = require('morgan');
const path = require('path');
//const socketIO = require('socket.io');
const router = require('./routes/index');
const { auth } = require('express-openid-connect');
const jose = require('jose');

// Add a sesssion store. In this example we are using an in-memory store
// which is not recommend for production systems!
const MemoryStore = require('memorystore')(auth);

dotenv.load();

const app = express();

const server = http.createServer(app);

// create websocket server connection
// const io = socketIO(server, {
//   cors: {
//     // origin: process.env.CLIENT_DOMAIN || 'localhost',
//     origin: process.env.BASE_URL, // for demo only, don't use * in production
//     methods: ['GET', 'POST'],
//   },
// });

// io.on('connection', function (socket) {
//   console.log("Connected succesfully to the socket bcapp2 ...");
//   console.log("Socket ID", socket.id); // prints "polling"
  
//   socket.on(`client_logout:${process.env.APP_NAME}`, function (data) {
//     console.log("bclda-2");
//       console.log(data);
//   });

//   socket.on(`sessionID`, function (sid) {
//     socket.join(sid);
//     console.log(` ${socket.id} joined room: ${sid}`);
//   });

//   socket.on("disconnect", (reason) => {
//     console.log(`disconnect ${socket.id} due to ${reason}`);
//   });

// });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// We need the express urlencoded middleware to process logout tokens
// which are sent using the HTTP POST method using
// the application/x-www-form-urlencoded encoding
app.use(express.urlencoded({ extended: true }));

const config = {
  authRequired: false,
  idpLogout: true,
  authorizationParams: {
    audience: 'https://api.com',
    scope: 'openid profile email read:data',
    response_type: 'code'
  },

  // Add session store to express-openid-connect
  session: {
    store: new MemoryStore({
      checkPeriod: 24 * 60 * 1000,
    }),
  },

  // Extract the sid and user_id from the ID token and add it to our session
  afterCallback: (req, res, session) => {
    const claims = jose.decodeJwt(session.id_token); // using jose library to decode JWT
    session['sid'] = claims.sid;
    session['user_id'] = claims.sub;
    return session;
  },
};

const port = process.env.PORT || 3000;
if (
  !config.baseURL &&
  !process.env.BASE_URL &&
  process.env.PORT &&
  process.env.NODE_ENV !== 'production'
) {
  config.baseURL = `http://localhost:${port}`;
}

app.use(auth(config));

// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  console.log(req.oidc);
  res.locals.loggedIn =  (typeof req.oidc.user == 'undefined') ? false : true;
  res.locals.sid = (typeof req.oidc.user == 'undefined') ? "" : req.oidc.user.sid
  next();
});

// Middleware to make the `sessionStore` and websocket io object available in the app object
app.use(function (req, res, next) {
  app.locals.sessionStore = config.session.store;
  //app.locals.io = io;
  app.locals.appName = process.env.APP_NAME;
  next();
});

app.use('/', router);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: process.env.NODE_ENV !== 'production' ? err : {},
  });
});

server.listen(port, () => {
  console.log(`Listening on ${config.baseURL}`);
});
