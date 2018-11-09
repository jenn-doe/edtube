const express = require('express');
const index = require('./routes');
const exphbs  = require('express-handlebars');
const createTables = require('./createTables');

const app = express();
const port = 8000;

app.engine('hbs', exphbs());
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');


app.use('/', index);

createTables();

app.listen(port);
console.log('Server listening on port ' + port);

