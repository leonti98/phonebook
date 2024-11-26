const express = require('express');
const app = express();
require('dotenv').config();

const Phonebook = require('./models/phonebook');

const morgan = require('morgan');
const cors = require('cors');

app.use(cors());

morgan.token('content', function (request, response) {
  console.log(request.body);

  return JSON.stringify(request.body);
});

const morganLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :content'
);

app.use(express.static('dist'));
app.use(express.json());
app.use(morganLogger);

const generateId = () => {
  const id = Math.floor(Math.random() * 1000000);
  return id;
};

app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get('/api/persons/:id', (request, response) => {
  const id = String(request.params.id);
  Phonebook.findById(id).then((person) => {
    response.json(person);
  });
});

app.get('/info', (request, response) => {
  Phonebook.countDocuments({})
    .then((count) => {
      const date = new Date();
      response.send(
        `<p>Phonebook has info for ${count} people</p><br><p>${date}</p>`
      );
    })
    .catch((error) => {
      response.status(500).send({ error: 'Something went wrong' });
    });
});

app.delete('/api/persons/:id', (request, response) => {
  const id = String(request.params.id);
  phonebook = phonebook.filter((p) => p.id !== id);
  response.status(204).end();
});

app.post('/api/persons', async (request, response) => {
  const body = request.body;
  // check if name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing',
    });
  }
  // check if name already exists
  const duplicate = await Phonebook.findOne({ name: body.name });
  if (duplicate) {
    return response.status(400).json({ error: 'name must be unique' });
  } else {
    const newPerson = new Phonebook({
      id: generateId(),
      name: body.name,
      number: body.number,
    });
    newPerson.save().then((savedPerson) => {
      response.json(savedPerson);
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
