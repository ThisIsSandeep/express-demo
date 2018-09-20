const express = require('express');
const app = express();

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
