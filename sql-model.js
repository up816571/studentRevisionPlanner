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

async function getSessions(userid) {
  const sql = await init();

  const query = sql.format('SELECT * FROM sessions WHERE userid = ?', userid);
  const [sessions] = await sql.query(query);
  return sessions;
}

module.exports = {
  getSessions: getSessions,
};
