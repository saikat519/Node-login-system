const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/database');
const Sequelize = require('sequelize');
const bodyParser= require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//Test DB
try {
    db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

//ejs
app.use(expressLayouts);
app.set('view engine','ejs');

// Routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))


app.listen(PORT,console.log(`Listen at ${PORT}`))