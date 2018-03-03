
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
app.get('/data/sessions', getSessionsToPage);

//server function

async function getSessionsToPage(req, res) {
  let pageDisplacer = req.query.page;
  let pageType = req.query.type;
  res.send(await db.getSessions(req.user.id, pageDisplacer, pageType));
}
