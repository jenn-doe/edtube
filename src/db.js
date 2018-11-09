const pgp = require('pg-promise')();

const db = pgp('postgres://postgres:postgres@localhost:5432/edtube');

module.exports = db;
