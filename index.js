const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

courses = [
  { id: 1, name: 'Node js' },
  { id: 2, name: 'React JS' },
  { id: 3, name: 'Mongo Db' }
];

app.get('/', (req, res) => {
  res.send('Hello World !!!');
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
