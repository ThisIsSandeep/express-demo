const Joi = require('joi');
const express = require('express');
const router = express.Router();

courses = [
  { id: 1, name: 'Node js' },
  { id: 2, name: 'React JS' },
  { id: 3, name: 'Mongo Db' }
];

router.use(express.json());

router.get('/', (req, res) => {
  res.send(courses);
});

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send('Course you want to delete no found');
    return;
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

router.get('/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));

  if (!course) {
    // 404 not found
    res.status(404).send('The course with given id not found');
  } else {
    res.send(course);
  }
});

function vaidateCourses(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  return Joi.validate(course, schema);
}

module.exports = router;
