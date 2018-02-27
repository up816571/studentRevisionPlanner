
'use static';

const express = require('express');
const app = express();
const db = require('./sql-model.js');

const GoogleAuth = require('simple-google-openid');

// you can put your client ID here
app.use(GoogleAuth("362093077322-52bsmepqvg5q21atf3fp8rib88c6e09k.apps.googleusercontent.com"));

// this will serve the HTML file shown below
app.use('/', express.static('webpage'));

app.get('/api/hello', (req, res) => {
  res.send('Hello ' + (req.user.displayName || 'user without a name') + '!');

  console.log('successful authenticated request by ' + req.user.emails[0].value);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  console.log(`Example app listening on port ${PORT}!`);
  console.log(await db.getSessions("1"));
});

// Server API
app.get('/data/sessions', getSessionsToPage);

//server function

async function getSessionsToPage(req, res) {
  res.send(await db.getSessions(req.user.id));
}
