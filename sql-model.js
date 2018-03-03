// create one connection to the database
let sqlPromise = null;

const mysql = require('mysql2/promise');
const config = require('./config.json');

async function init() {
  if (sqlPromise) return sqlPromise;

  sqlPromise = newConnection();
  return sqlPromise;
}

async function shutDown() {
  if (!sqlPromise) return;
  const stashed = sqlPromise;
  sqlPromise = null;
  await releaseConnection(await stashed);
}

async function newConnection() {
  const sql = await mysql.createConnection(config.mysql);

  // handle unexpected errors by just logging them
  sql.on('error', (err) => {
    console.error(err);
    sql.end();
  });

  return sql;
}

async function releaseConnection(connection) {
  await connection.end();
}

async function getSessions(userid, pageDisplacer, pageType) {
  const sql = await init();

  let todaysDate = new Date();
  let day = 60 * 60 * 24 * 1000;
  let newDate = new Date(todaysDate.getTime() + day * pageDisplacer);
  let formattedMinDate = newDate.toISOString().substring(0, 10);
  let formattedMaxDate = formattedMinDate;

  if (pageType == 'week') {
    let now = newDate? new Date(newDate) : new Date();

    now.setHours(0,0,0,0);

    let monday = new Date(now);
    monday.setDate(monday.getDate() - monday.getDay() + 1);
    formattedMinDate = monday.toISOString().substring(0, 10);

    let sunday = new Date(now);
    sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
    formattedMaxDate = sunday.toISOString().substring(0, 10);
  }

  const query = sql.format('SELECT * FROM sessions WHERE userid = ? AND sessionDate >= ? AND sessionDate <= ? ORDER BY sessionDate, sessionTime', [userid, formattedMinDate, formattedMaxDate]);
  const [sessions] = await sql.query(query);
  return sessions;
}

module.exports = {
  getSessions: getSessions,
};
