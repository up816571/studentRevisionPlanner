
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
  console.log(`Revsion app listening on port ${PORT}!`);
});

// Server API

//app.get /data/sessions is used to get sessions from the sql database to the page
//app.get /api/hello is used for authentication
//app.get /data/sessions/single is used for editing a session
//app.post /data/sessions is used to put imputs from the user in to the database
//app.post /data/sessions/edit is used to save a single edited session
//app.delete /data/sessions/delete is used to remove a session

app.get('/data/sessions', getSessionsToPage);
app.get('/api/hello', userAuth);
app.get('/data/sessions/single', getSingleSession);
app.post('/data/sessions', postNewSessions);
app.post('/data/sessions/edit', saveSingleSession);
app.delete('/data/sessions/delete', deleteSingleSession);

// Server function

//Authentication function
async function userAuth (req, res) {
  res.send(req.user.displayName || 'user without a name');
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

//Loads a single session
async function getSingleSession(req, res) {
  const sessionId = req.query.sessionid;
  res.send(await db.getSingleSession(sessionId, req.user.id));
}

//Saves a single session bak to the database
async function saveSingleSession(req, res) {
  const sessionid = req.query.sessionid;
  const title = req.query.title;
  const date = req.query.date;
  const time = req.query.time;
  const desc = req.query.desc;
  const type = req.query.type;
  res.send(await db.saveSingleSession(sessionid, title, date, time, desc, type, req.user.id));
}

//Removes a session from the database
async function deleteSingleSession(req, res) {
  const sessionid = req.query.sessionid;
  res.send(await db.deleteSession(sessionid, req.user.id));
}
