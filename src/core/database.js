const Database = require('better-sqlite3');
const db = Database('Alcohol.db');

module.exports = db;