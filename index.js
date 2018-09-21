const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const logger = require('./logger');
const express = require('express');
const app = express();

// ------ template engines (sometimes we wanna show html to user where template engines comes into picture) ---------
// When we set view engine to pug express load internally pug module we don't need to require explicitly
app.set('view engine', 'pug');
// app.set('views', './views'); // default and its optional

// Environments
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`App: ${app.get('env')}`); // If NODE_ENV is not setup by default app.get gives development env

app.use(express.json());

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

courses = [
  { id: 1, name: 'Node js' },
  { id: 2, name: 'React JS' },
  { id: 3, name: 'Mongo Db' }
];

app.get('/', (req, res) => {
  // res.send('Hello World !!!');
  res.render('index', {
    title: 'My Express App',
    message: 'My Express App!'
  });
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.post('/api/courses', (req, res) => {
  const { error } = vaidateCourses(req.body);
  if (error) {
    // 400 Bad request
    res.status(400).send(error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
    // in order to req.body work we need to enable parsing of json object in the body of req b/c by default this feature is not enabled in express
  };
  courses.push(course);
  res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
  // Check for course is exists
  const course = courses.find(c => c.id === parseInt(req.params.id));

  // If not exist return 404
  if (!course) {
    res.status(404).send('Course you are trying to update not found');
    return;
  }

  // Validate course
  const { error } = vaidateCourses(req.body);

  // If invalid, return 400
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // Update course
  course.name = req.body.name;
  // Return the course
  res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send('Course you want to delete no found');
    return;
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

function vaidateCourses(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  return Joi.validate(course, schema);
}

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));

  if (!course) {
    // 404 not found
    res.status(404).send('The course with given id not found');
  } else {
    res.send(course);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
