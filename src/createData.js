const db = require('./db');
const tables = require('./tables');

function dropTables() {
  const dropTable = `
    DROP TABLE IF EXISTS
      ${tables.tubeUser},
      ${tables.postalCode}
    ;`;
  return db.any(dropTable);
}

function createTablePostalCode() {
  const createPostalCode = `
    CREATE TABLE ${tables.postalCode} (
      postalCode CHAR(7),
      city VARCHAR(280),
      province VARCHAR(280),
      PRIMARY KEY (postalCode)
    );`;
  return db.any(createPostalCode);
}

function insertPostalCodes() {
  const insertPostalCodes = `
    INSERT INTO ${tables.postalCode} VALUES
      ('A1B 2C3', 'Toronto', 'Ontario'),
      ('V1N 2K5', 'Vancouver', 'British Columbia')
    ;`;
  return db.any(insertPostalCodes);
}

function createTableUsers() {
  const createUserTable = `
    CREATE TABLE ${tables.tubeUser} (
      uName VARCHAR(40),
      biography VARCHAR(280),
      name VARCHAR(280),
      email VARCHAR(40),
      address VARCHAR(40),
      postalCode VARCHAR(40),
      PRIMARY KEY (uName),
      FOREIGN KEY (postalCode) REFERENCES postalCode (postalCode)
    );`;
  return db.any(createUserTable);
}

function insertUsers() {
  const insertUsers = `
    INSERT INTO ${tables.tubeUser} VALUES
      ('julez', 'Im sparkling', 'Julie Jones', 'julez@jjmail.com', '123 Bloor St', 'A1B 2C3'),
      ('choo', 'Fun times', 'Chris Kross', 'chrisk@umail.com', '554 Broadway St', 'V1N 2K5')
    ;`;
  return db.any(insertUsers);
}

module.exports = function createTables() {
  dropTables()
    .then(createTablePostalCode)
    .then(createTableUsers)
    .then(insertPostalCodes)
    .then(insertUsers)
    .catch((err) => console.log(err));
}