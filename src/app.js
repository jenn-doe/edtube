const express = require('express');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const example = require('./routes/example');
const exphbs  = require('express-handlebars');
const createData = require('./createData');

const app = express();
const port = 8000;

app.engine('hbs', exphbs());
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', index);
app.use('/example', example);

createData();

app.listen(port);
console.log('Server listening on port ' + port);

