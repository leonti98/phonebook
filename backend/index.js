const express = require("express");
const app = express();
const morgan = require("morgan");

let phonebook = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token("content", function (req, res) {
  console.log(req.body);

  return JSON.stringify(req.body);
});

const morganLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms :content"
);

app.use(express.json());
app.use(morganLogger);

const cors = require("cors");

app.use(cors());

const generateId = () => {
  const id = Math.floor(Math.random() * 1000000);
  return id;
};

app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

app.get("/api/persons/:id", (request, response) => {
  const id = String(request.params.id);
  const person = phonebook.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    console.log("not found");
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  const phonebookLength = phonebook.length;
  const date = new Date();
  response.send(
    `<p>Phonebook has info for ${phonebookLength} people</p><br><p>${date}</p>`
  );
});

app.delete("/api/persons/:id", (request, response) => {
  const id = String(request.params.id);
  phonebook = phonebook.filter((p) => p.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const duplicate = phonebook.find((person) => body.name === person.name);
  if (duplicate) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  phonebook = phonebook.concat(newPerson);

  response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
