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

app.get('/info', (request, response, next) => {
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

app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(200).json(result);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post('/api/persons', async (request, response, next) => {
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
      name: body.name,
      number: body.number,
    });
    newPerson
      .save()
      .then((savedPerson) => {
        response.json(savedPerson);
      })
      .catch((error) => {
        return next(error);
      });
  }
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Phonebook.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json(error);
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
