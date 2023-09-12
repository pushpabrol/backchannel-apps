const express = require('express');
const router = express.Router();
const logoutMessage = require('../utils/logoutMessage');

const { requiresAuth } = require('express-openid-connect');

// middleware to validate the logout token
const requiresValidLogoutToken = require('../middlewares/validateLogoutToken');

// helper function to delete user sessions
const deleteUserSessions = require('../utils/sessions');

router.post(
  '/backchannel-logout',
  requiresValidLogoutToken,
  async function (req, res, next) {


    // at this point the logout token is valid
    // you can access it from the request object: req.logoutToken
    // the payload looks like this:
    // {
    //   iss: 'https://dev-udo.local.dev.auth0.com/',
    //   sub: 'user',
    //   aud: 'X5tAK1WsWD8Lyfexx6Qpo9UkT2ATM0C0',
    //   iat: 1659611563,
    //   jti: 'fac52fdf-466e-4f32-8389-39b90681d310',
    //   events: { 'http://schemas.openid.net/event/backchannel-logout': {} },
    //   trace_id: 'a8e88fcb-6f9a-4035-9ac8-1c378227b4e3',
    //   sid: 'test-session-id'
    // }
    console.log("was called");
    // delete user session so the user gets logged out
    deleteUserSessions(
      req.app.locals.sessionStore,
      req.logoutToken.sub,
      req.logoutToken.sid
    );

    // emit an event via websocket so the frontend can be notified to reload the page

      //req.app.locals.io.to(req.logoutToken.sid).emit(`client_logout:${process.env.APP_NAME}`, 'Client has been logged out');
      await logoutMessage(req.logoutToken.sid)

    res.sendStatus(200);
  }
);



router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated(),
    headline: process.env.APP_NAME,
    backgroundColor: process.env.BACKGROUND_COLOR,
    baseURL: process.env.BASE_URL,
    idToken: req.oidc ? req.oidc.idToken : null
  });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  console.log(req.oidc.accessToken);
  console.log(req.oidc.idToken);

  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page',
    headline: process.env.APP_NAME,
    backgroundColor: process.env.BACKGROUND_COLOR,
    baseURL: process.env.BASE_URL,
    sid: req.oidc.user.sid,
    idToken: req.oidc.idToken
  });
});

module.exports = router;
