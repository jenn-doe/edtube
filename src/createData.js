const db = require('./db');

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
      postalCode  VARCHAR(6),
      city			  VARCHAR(40),
      province		VARCHAR(40),
      PRIMARY KEY (postalCode)
    );`;
  return db.any(sql);
}

function insertPostalCode() {
  const sql = `
    INSERT INTO PostalCode VALUES
      ('A1B2C3', 'Toronto', 'Ontario'),
      ('V1N2K5', 'Vancouver', 'British Columbia')
    ;`;
  return db.any(sql);
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

function insertCategory() {
  const sql =`
    INSERT INTO Category VALUES
      ('Comedy', 'Videos that will tickle your funny bone'),
      ('Animals', 'Videos containing cute animals'),
      ('Adventure', 'Videos of explorers'),
      ('Music', 'Videos that have some sort of music'),
      ('Dance', 'Videos you can dance to'),
      ('Songs', 'Videos containing songs'),
      ('Upbeat', 'Videos that are upbeat and cheerful'),
      ('Chill', 'Videos you can chill to'),
      ('Cooking', 'Videos about cooking'),
      ('GlutenFree', 'Videos for the gluten free eaters'),
      ('Desserts', 'Videos for desserts!')
  `;
  return db.any(sql);
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
    INSERT INTO Storage VALUES
      ('MapleLeaf', 'Quebec'),
      ('GreenLeaf', 'WestCoast'),
      ('Maritimes', 'EastCoast')
  `;
  return db.any(sql);
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
    INSERT INTO DateTime VALUES
    (01012018, 1147),
    (02032017, 2230),
    (06272018, 2318),
    (06282018, 0023),
    (06282018, 0027),
    (02222018, 1312),
    (02232018, 1426),
    (03142017, 2201),
    (03212017, 1947),
    (06302018, 0923),
    (06302018, 0927),
    (08062018, 1133),
    (09242018, 1027),
    (07012018, 1234),
    (07012018, 1423),
    (02252018, 1826),
    (06232018, 2236)
  `;
  return db.any(sql);
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
    INSERT INTO Network VALUES
      ('FoodNetwork', 10, 'Cooking classes and more', 'food@network.com'),
      ('StudentNetwork', 5, 'Tips for student life, studying, and more', 'student@network.com'),
      ('WallStreetNetwork', 25, 'All the latest on stocks, business, and finance', 'wallstreet@network.com'),
      ('ZBOXNetwork', 35, 'Watch your favorite gamers', 'zbox@network.com'),
      ('MusicNetwork', 10, 'Listen to your favorite music', 'music@network.com')
  `;
  return db.any(sql);
}

function createTableTubeUser() {
  const sql = `
    CREATE TABLE TubeUser(
      uName			  VARCHAR(40),
      biography		VARCHAR(280),
      name			  VARCHAR(40),
      email			  VARCHAR(40),
      address		  VARCHAR(40),
      postalCode  VARCHAR(6),
      PRIMARY KEY (uName),
      FOREIGN KEY (postalCode) REFERENCES PostalCode
        ON DELETE SET NULL
        ON UPDATE CASCADE
    );`;
  return db.any(sql);
}

function insertTubeUser() {
  const sql = `
    INSERT INTO TubeUser VALUES
      ('julez', 'Im sparkling', 'Julie Jones', 'julez@jjmail.com', '123 Bloor St', 'A1B2C3'),
      ('jennyyy', 'Live, Love, Laugh', 'Jenny Chamberlain', 'unicorn12@umail.com', '475 Angel Dr', 'A1B2C3'),
      ('halofiend', 'Gamerz for life', 'David West', 'halo71@umail.com', '9004 West 9th Ave', 'A1B2C3'),
      ('choo', 'Fun times', 'Chris Kross', 'chrisk@umail.com', '554 Broadway St', 'V1N2K5')
    ;`;
  return db.any(sql);
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
    INSERT INTO Playlist_Creates VALUES
      ('ChillTunes', 'music to relax to', 'julez'),
      ('DanceParty', 'lets get pumped', 'julez'),
      ('StudyTunes', 'music for studying to', 'choo')
  `;
  return db.any(sql);
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
    INSERT INTO Follows VALUES
      ('julez', 'choo'),
      ('choo', 'julez'),
      ('choo', 'halofiend'),
      ('julez', 'jennyyy')
  `;
  return db.any(sql);
}

function createTableChannelOwnsBelongsTo() {
  const sql =`
    CREATE TABLE Channel_Owns_BelongsTo(
      cName			  VARCHAR(40),
      description	VARCHAR(280),
      uName			  VARCHAR(40) NOT NULL,
      nName			  VARCHAR(40),
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
    INSERT INTO Channel_Owns_BelongsTo VALUES
      ('WeekendFun', 'Snaps from my weekend!', 'julez', NULL),
      ('MusicStuff', 'Music of my life', 'julez', 'MusicNetwork'),
      ('Music', 'Songs to dance around to', 'choo', 'MusicNetwork'),
      ('MusicalTunes', 'Just a bunch of songs I listen to', 'halofiend', 'MusicNetwork'),
      ('MomsMeals', 'Recipes from the kitchen of a mother', 'jennyyy', 'FoodNetwork'),
      ('SickSnaps', 'Game clips of my sick skills', 'halofiend', 'ZBOXNetwork')
  `;
  return db.any(sql);
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
    INSERT INTO Subscribe VALUES
      ('julez', 'MomsMeals', TRUE),
      ('choo', 'SickSnaps', FALSE),
      ('choo', 'WeekendFun', TRUE)
  `;
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
      storageServer	VARCHAR(40) NOT NULL,
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
    INSERT INTO Video_PostedAt_Contains VALUES
      (1, 'hanging out at the beach', 'Beach Fun!', 230, 'WeekendFun', 06272018, 2318, 'MapleLeaf'),
      (2, 'supper with my girls', 'BBQ Hut', 118, 'WeekendFun', 06282018, 0023, 'MapleLeaf'),
      (3, 'club life foreverrrr', 'Dancing at QTs', 123, 'WeekendFun', 06282018, 0027, 'MapleLeaf'),
      (4, 'chicken in a white sauce with veggies', 'chicken a la king', 1210, 'MomsMeals', 02222018, 1312, 'EastCoast'),
      (5, 'Smooth chocolate mousse without flour', 'Gluten Free Chocolate Cake', 1023, 'MomsMeals', 02232018, 1426, 'EastCoast'),
      (6, 'Snipes for dayyyyys in multiplayer', 'Sniping fools', 134, 'SickSnaps', 03142017, 2201, 'WestCoast'),
      (7, 'Explosions on Falsity', 'Merqed those noobs', 156, 'SickSnaps', 03212017, 1947, 'WestCoast'),
      (8, 'super chill dance music by DJ Sych', 'ClubLife Vol3', 335, 'MusicStuff', 06302018, 0923, 'MapleLeaf'),
      (9, 'super duper chill dance music by DJ James', 'ClubLife Vol2', 329, 'MusicStuff', 06302018, 0927, 'MapleLeaf'),
      (10, 'dance tunes by DJ Merc', 'ClubLife Vol4', 553, 'MusicStuff', 08062018, 1133, 'MapleLeaf'),
      (11, 'crazy club set', 'DJ James Live', 425, 'MusicStuff', 09242018, 1027, 'MapleLeaf'),
      (12, 'classical jazz music by the best', 'Jazz Life', 501, 'MusicalTunes', 06302018, 0923, 'EastCoast'),
      (13, 'classical piano with no lyrics', 'Scales and More', 554, 'MusicalTunes', 06302018, 0927, 'EastCoast'),
      (14, 'violins, cellos, and more', 'Strings', 329, 'MusicalTunes', 08062018, 1133, 'EastCoast'),
      (15, 'piano concert that happened near me', 'Beautiful Piano', 444, 'MusicalTunes', 09242018, 1027, 'EastCoast'),
      (16, 'the best music for relaxing to', 'Chill tune time', 335, 'Music', 06302018, 0923, 'WestCoast'),
      (17, 'the hippest beats ever', 'Bounce Beats', 329, 'Music', 06302018, 0927, 'WestCoast'),
      (18, 'dance music beats', 'Dance life', 553, 'Music', 08062018, 1133, 'WestCoast'),
      (19, 'sleepytime songs', 'Relaxing Sleep Songs', 425, 'Music', 09242018, 1027, 'WestCoast')
  `;
  return db.any(sql);
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
    INSERT INTO Monetized VALUES
      (4, 100, 10),
      (5, 100, 10),
      (6, 80, 5)
  `;
  return db.any(sql);
}

function createTablePartOf() {
  const sql =`
    CREATE TABLE PartOf(
      pName			  VARCHAR(40),
      uName			  VARCHAR(40),
      vID			    INTEGER,
      PRIMARY KEY (pName, uName, vID),
      FOREIGN KEY (uName, pName) REFERENCES Playlist_Creates
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
    INSERT INTO PartOf VALUES
      ('ChillTunes', 'julez', 8),
      ('ChillTunes', 'julez', 9),
      ('ChillTunes', 'julez', 16),
      ('ChillTunes', 'julez', 19),
      ('DanceParty', 'julez', 8),
      ('DanceParty', 'julez', 10),
      ('DanceParty', 'julez', 11),
      ('DanceParty', 'julez', 17),
      ('DanceParty', 'julez', 18),
      ('StudyTunes', 'choo', 12),
      ('StudyTunes', 'choo', 13),
      ('StudyTunes', 'choo', 14)
  `;
  return db.any(sql);
}

function createTableClassified() {
  const sql =`
    CREATE TABLE Classified(
      vID			    INTEGER,
      catName		  VARCHAR(40),
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
    INSERT INTO Classified VALUES
      (11, 'Music'),
      (1, 'Adventure'),
      (12, 'Music'),
      (6, 'Adventure'),
      (7, 'Adventure'),
      (13, 'Music'),
      (3, 'Adventure'),
      (15, 'Music'),
      (2, 'GlutenFree'),
      (2, 'Desserts'),
      (4, 'Cooking'),
      (5, 'Cooking'),
      (5, 'GlutenFree'),
      (5, 'Desserts')
  ;`;
  return db.any(sql);
}

function createTableCommentWrites() {
  const sql =`
    CREATE TABLE Comment_Writes(
      cID			    INTEGER,
      text		    VARCHAR(280) NOT NULL,
      date		    INTEGER NOT NULL,
      time		    INTEGER NOT NULL,
      uName		    VARCHAR(40) NOT NULL,
      vID			    INTEGER NOT NULL,
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
    INSERT INTO Comment_Writes VALUES
      (1, 'Looks like so much fun honey!', 07012018, 1234, 'jennyyy', 1),
      (2, 'Wish I could have been there', 07012018, 1423, 'choo', 1),
      (3, 'This looks so delicious, I want to eat it NOW', 02252018, 1826, 'julez', 5),
      (4, 'So sick dude', 06232018, 2236, 'choo', 7)
  `;
  return db.any(sql);
}

module.exports = function createData() {
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
