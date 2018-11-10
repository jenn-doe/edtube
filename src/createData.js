const db = require('./db');
const tables = require('./tables');

function dropTables() {
  const sql = `
    DROP TABLE IF EXISTS
      Comment_Writes,
      Classified,
      PartOf,
      Monetized,
      Video_PostedAt_Contains,
      Subscribe,
      Channel_Owns_BelongsTo,
      Follows,
      Playlist_Creates,
      TubeUser,
      Network,
      DateTime,
      Storage,
      Category,
      PostalCode
    ;`;
  return db.any(sql);
}

function createTablePostalCode() {
  const sql = `
    CREATE TABLE PostalCode(
      postalCode		VARCHAR(6),
      city			    VARCHAR(40),
      province		  VARCHAR(40),
      PRIMARY KEY (postalCode)
    );`;
  return db.any(sql);
}

function insertPostalCode() {
  const sql = `
    INSERT INTO ${tables.postalCode} VALUES
      ('A1B2C3', 'Toronto', 'Ontario'),
      ('V1N2K5', 'Vancouver', 'British Columbia')
    ;`;
  return db.any(sql);
}

function createTableTubeUser() {
  const sql = `
    CREATE TABLE TubeUser(
      uName			VARCHAR(40),
      biography		VARCHAR(280),
      name			VARCHAR(40),
      email			VARCHAR(40),
      address		VARCHAR(40),
      postalCode		VARCHAR(6),
      PRIMARY KEY (uName),
      FOREIGN KEY (postalCode) REFERENCES PostalCode
        ON DELETE SET NULL
        ON UPDATE CASCADE
    );`;
  return db.any(sql);
}

function insertTubeUser() {
  const sql = `
    INSERT INTO ${tables.tubeUser} VALUES
      ('julez', 'Im sparkling', 'Julie Jones', 'julez@jjmail.com', '123 Bloor St', 'A1B2C3'),
      ('choo', 'Fun times', 'Chris Kross', 'chrisk@umail.com', '554 Broadway St', 'V1N2K5')
    ;`;
  return db.any(sql);
}

function createTableVideoPostedAtContains() {
  const sql =`
    CREATE TABLE Video_PostedAt_Contains(
      vID			      INTEGER,
      description		VARCHAR(280),
      vName			    VARCHAR(40) NOT NULL,
      playtime		  INTEGER NOT NULL,
      cName			    VARCHAR(40) NOT NULL,
      date			    INTEGER NOT NULL,
      time			    INTEGER NOT NULL,
      storageServer		VARCHAR(40) NOT NULL,
      PRIMARY KEY (vID),
      FOREIGN KEY (cName) REFERENCES Channel_Owns_BelongsTo
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      FOREIGN KEY (date, time) REFERENCES DateTime
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
    )`;
  return db.any(sql);
}

// TODO
function insertVideoPostedAtContains() {
  const sql =`
  
  `;
  //return db.any(sql);
}

function createTableStorage() {
  const sql =`
    CREATE TABLE Storage(
      storageServer		VARCHAR(40),
      storageRegion		VARCHAR(40),
      PRIMARY KEY (storageServer)
    )`;
  return db.any(sql);
}

// TODO
function insertStorage() {
  const sql =`
  
  `;
  //return db.any(sql);
}

function createTableFollows() {
  const sql =`
    CREATE TABLE Follows(
      follower_uName	VARCHAR(40),
      followed_uName	VARCHAR(40),
      Notifications		BOOLEAN,
      PRIMARY KEY (follower_uName, followed_uName),
      FOREIGN KEY (follower_uName) REFERENCES TubeUser
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      FOREIGN KEY (followed_uName) REFERENCES TubeUser
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )`;
  return db.any(sql);
}

// TODO
function insertFollows() {
  const sql =`
  
  `;
  //return db.any(sql);
}

function createTableChannelOwnsBelongsTo() {
  const sql =`
    CREATE TABLE Channel_Owns_BelongsTo(
      cName			    VARCHAR(40),
      description		VARCHAR(280),
      uName			    VARCHAR(40) NOT NULL,
      nName			    VARCHAR(40),
      PRIMARY KEY (cName),
      FOREIGN KEY (uName) REFERENCES TubeUser
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      FOREIGN KEY (nName) REFERENCES Network
        ON DELETE SET NULL
        ON UPDATE CASCADE
    )`;
  return db.any(sql);
}

// TODO
function insertChannelOwnsBelongsTo() {
  const sql =`
  
  `;
  //return db.any(sql);
}

function createTableNetwork() {
  const sql =`
    CREATE TABLE Network(
      nName		   	VARCHAR(40),
      rate			  INTEGER,
      description	VARCHAR(280),
      email		   	VARCHAR(40),
      PRIMARY KEY (nName)
    )`;
  return db.any(sql);
}

// TODO
function insertNetwork() {
  const sql =`
  
  `;
  //return db.any(sql);
}

function createTableSubscribe() {
  const sql =`
    CREATE TABLE Subscribe(
      uName			    VARCHAR(40),
      cName			    VARCHAR(40),
      notifications BOOLEAN,
      PRIMARY KEY (uName, cName),
      FOREIGN KEY (uName) REFERENCES TubeUser
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      FOREIGN KEY (cName) REFERENCES Channel_Owns_BelongsTo
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )`;
  return db.any(sql);
}

// TODO
function insertSubscribe() {
  const sql =`
  `;
  //return db.any(sql);
}

function createTableDateTime() {
  const sql =`
    CREATE TABLE DateTime(
      date			INTEGER,
      time			INTEGER,
      PRIMARY KEY (date, time)
    )`;
  return db.any(sql);
}

// TODO
function insertDateTime() {
  const sql =`
  
  `;
  //return db.any(sql);
}

function createTableCommentWrites() {
  const sql =`
    CREATE TABLE Comment_Writes(
      cID			INTEGER,
      text		VARCHAR(280) NOT NULL,
      date		INTEGER NOT NULL,
      time		INTEGER NOT NULL,
      uName		VARCHAR(40) NOT NULL,
      vID			INTEGER NOT NULL,
      PRIMARY KEY (cID),
      FOREIGN KEY (date, time) REFERENCES DateTime
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
      FOREIGN KEY (uName) REFERENCES TubeUser
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      FOREIGN KEY (vID) REFERENCES Video_PostedAt_Contains
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )`;
  return db.any(sql);
}

// TODO
function insertCommentWrites() {
  const sql =`
  
  `;
  //return db.any(sql);
}

function createTableMonetized() {
  const sql =`
    CREATE TABLE Monetized(
      vID			    INTEGER,
      feePaid		  INTEGER,
      ratePerView	INTEGER,
      PRIMARY KEY (vID),
      FOREIGN KEY (vID) REFERENCES Video_PostedAt_Contains
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )`;
  return db.any(sql);
}

// TODO
function insertMonetized() {
  const sql =`
  
  `;
  //return db.any(sql);
}

function createTablePlaylistCreates() {
  const sql =`
    CREATE TABLE Playlist_Creates(
      pName			  VARCHAR(40),
      description	VARCHAR(280),
      uName		   	VARCHAR(40),
      PRIMARY KEY (uName, pName),
      FOREIGN KEY (uName) REFERENCES TubeUser
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )`;
  return db.any(sql);
}

// TODO
function insertPlaylistCreates() {
  const sql =`
  
  `;
  //return db.any(sql);
}

function createTablePartOf() {
  const sql =`
    CREATE TABLE PartOf(
      pName			VARCHAR(40),
      uName			VARCHAR(40),
      vID			  INTEGER,
      PRIMARY KEY (pName, uName, vID),
      FOREIGN KEY (pName, uName) REFERENCES Playlist_Creates
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      FOREIGN KEY (uName) REFERENCES TubeUser
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      FOREIGN KEY (vID) REFERENCES Video_PostedAt_Contains
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )`;
  return db.any(sql);
}

// TODO
function insertPartOf() {
  const sql =`
  
  `;
  //return db.any(sql);
}

function createTableCategory() {
  const sql =`
  CREATE TABLE Category(
    catName		  VARCHAR(40),
    description	VARCHAR(280),
    PRIMARY KEY (catName)
  )`;
  return db.any(sql);
}

// TODO
function insertCategory() {
  const sql =`
  
  `;
  //return db.any(sql);
}

function createTableClassified() {
  const sql =`
    CREATE TABLE Classified(
      vID			  INTEGER,
      catName		VARCHAR(40),
      PRIMARY KEY (vID, catName),
      FOREIGN KEY (vID) REFERENCES Video_PostedAt_Contains
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      FOREIGN KEY (catName) REFERENCES Category
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )`;
  return db.any(sql);
}

// TODO
function insertClassified() {
  const sql =`
  
  `;
  //return db.any(sql);
}

module.exports = function createTables() {
  dropTables()
    // tables with no foreign key references
    .then(createTablePostalCode)
    .then(createTableCategory)
    .then(createTableStorage)
    .then(createTableDateTime)
    .then(createTableNetwork)

    // tables with foreign key references related to TubeUser
    .then(createTableTubeUser)
    .then(createTablePlaylistCreates)
    .then(createTableFollows)
    .then(createTableChannelOwnsBelongsTo)
    .then(createTableSubscribe)

    // tables with foreign key references related to Video_PostedAt_Contains
    .then(createTableVideoPostedAtContains)
    .then(createTableMonetized)
    .then(createTablePartOf)
    .then(createTableClassified)
    .then(createTableCommentWrites)
    
    // insert data with no foreign key references
    .then(insertPostalCode)
    .then(insertCategory)
    .then(insertStorage)
    .then(insertDateTime)
    .then(insertNetwork)

    // insert data with foreign key references related to TubeUser
    .then(insertTubeUser)
    .then(insertPlaylistCreates)
    .then(insertFollows)
    .then(insertChannelOwnsBelongsTo)
    .then(insertSubscribe)

    // insert data with foreign key references related to Video_PostedAt_Contains
    .then(insertVideoPostedAtContains)
    .then(insertMonetized)
    .then(insertPartOf)
    .then(insertClassified)
    .then(insertCommentWrites)
    .catch((err) => console.log(err));
}