const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const home = require('./routes/home');
const express = require('express');
const app = express();

app.use('/api/courses', courses);
app.use('/', home);

// ------ template engines (sometimes we wanna show html to user where template engines comes into picture) ---------
// When we set view engine to pug express load internally pug module we don't need to require explicitly
app.set('view engine', 'pug');
// app.set('views', './views'); // default and its optional

// Environments
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`App: ${app.get('env')}`); // If NODE_ENV is not setup by default app.get gives development env

// Buit in middleware function
app.use(express.static('public'));
// Also check urlencoded built in middleware

// Custom Middleware function
app.use(logger);

// Third party middleware
app.use(helmet());
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('Morgan enabled...');
}

// Configuration
console.log(`Application name: ${config.get('name')}`);
console.log(`Mail server: ${config.get('mail.host')}`);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
