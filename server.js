
'use static';

const express = require('express');
const app = express();
const db = require('./sql-model.js');

const GoogleAuth = require('simple-google-openid');

// you can put your client ID here
app.use(GoogleAuth("111545869099-9g2l2jd6b9slqv6m7qgf0n7j5ub7crtu.apps.googleusercontent.com"));

// this will serve the HTML file shown below
app.use('/', express.static('webpages'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// Server API

//app.get /data/sessions is used to get sessions from the sql database to the page
//app.get /api/hello is used for authentication
//app.post /data/sessions is used to put imputs from the user in to the database
app.get('/data/sessions', getSessionsToPage);
app.get('/api/hello', userAuth);
app.post('/data/sessions', postNewSessions);

//server function

//Athentication function
async function userAuth (req, res) {
  res.send(req.user.displayName || 'user without a name');
  console.log('auth req by ' + req.user.emails[0].value);
}

//Used to get all querys to return the sessions
async function getSessionsToPage(req, res) {
  const pageDisplacer = req.query.page;
  const pageType = req.query.type;
  res.send(await db.getSessions(req.user.id, pageDisplacer, pageType));
}

//Uses all the query params to save a session
async function postNewSessions(req, res) {
  const title = req.query.title;
  const date = req.query.date;
  const time = req.query.time;
  const desc = req.query.desc;
  const type = req.query.type;
  res.send(await db.addSession(title, date, time, desc, type, req.user.id));
}
