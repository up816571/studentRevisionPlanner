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

  //Get the date based on the page query
  let todaysDate = new Date();
  //A day in miliseconds used for adding a day on to an exesting date
  const day = 60 * 60 * 24 * 1000;
  //New date is used in all calculations and will be a single date
  let newDate = new Date(todaysDate.getTime() + day * pageDisplacer);

  //Defualt for a single day being Displayed
  let formattedMinDate = newDate.toISOString().substring(0, 10);
  let formattedMaxDate = formattedMinDate;

  //If on week view then calculate the date for monday and sunday
  if (pageType == 'week') {
    let now = newDate? new Date(newDate) : new Date();

    now.setHours(0,0,0,0);

    let monday = new Date(now);
    monday.setDate(monday.getDate() - monday.getDay() + 1);
    formattedMinDate = monday.toISOString().substring(0, 10);

    let sunday = new Date(now);
    sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
    formattedMaxDate = sunday.toISOString().substring(0, 10);
  } else if (pageType == 'month') {
    //Get the first and last days in a month
    let firstDay = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    formattedMinDate = firstDay.toISOString().substring(0, 10);
    let lastDay = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
    formattedMaxDate = lastDay.toISOString().substring(0, 10);
  }

  //Get all dates in the range given from the sql
  const query = sql.format('SELECT * FROM sessions WHERE userid = ? AND sessionDate >= ? AND sessionDate <= ? ORDER BY sessionDate, sessionTime', [userid, formattedMinDate, formattedMaxDate]);
  const [sessions] = await sql.query(query);
  return sessions;
}

module.exports = {
  getSessions: getSessions,
};
