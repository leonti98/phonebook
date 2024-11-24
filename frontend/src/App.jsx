import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import Person from './components/Person';
import phonebookService from './services/phoneBook';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [formData, setFormData] = useState({ personName: '', number: '' });
  const [addingDuplcate, setAddingDuplcate] = useState(false);
  const [lastEntry, setLastEntry] = useState('');
  const [searchField, setSearchField] = useState('');
  const [notification, setNotification] = useState({
    message: '',
    danger: false,
  });

  useEffect(() => {
    phonebookService.getPeople().then((people) => setPersons(people));
  }, []);

  const checkDuplicate = (newEntry) => {
    const alreadyExists = persons.find(
      (person) => person.name === newEntry.name
    );
    if (alreadyExists === undefined) {
      setAddingDuplcate(false);
      return false;
    } else {
      setAddingDuplcate(true);
      return alreadyExists;
    }
  };

  const addPerson = (event) => {
    event.preventDefault();
    const newEntry = {
      name: formData.personName,
      number: formData.number,
    };
    const checkResult = checkDuplicate(newEntry);
    if (checkResult) {
      if (window.confirm(`want to update ${newEntry.name}'s number?`)) {
        phonebookService
          .updatePersonNumber(checkResult.id, newEntry)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === returnedPerson.id ? returnedPerson : person
              )
            );
            setNotification({
              message: `${formData.personName}'s number has been updated`,
              danger: false,
            });
          });
        setLastEntry(`${formData.personName}'s number has been updated`);
      } else {
        setNotification({
          message: `person ${formData.personName} with number ${formData.number} is duplicate`,
          danger: true,
        });
      }
    } else {
      phonebookService.addPerson(newEntry).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setFormData({ personName: '', number: '' });
        setNotification({
          message: `person ${returnedPerson.name} with number ${returnedPerson.number} has been added`,
          danger: false,
        });
      });
    }
  };

  const handleFormChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const searchPerson = (event) => {
    setSearchField(event.target.value);
  };

  const deletePerson = (id) => {
    if (window.confirm('Do you really want to delete?')) {
      phonebookService
        .deletePerson(id)
        .then((deletedPerson) => {
          setPersons(
            persons.filter((person) => person.id !== deletedPerson.id)
          );
          setNotification({
            message: `${deletedPerson.name} has beed deleted`,
            danger: false,
          });
        })
        .catch((error) => {
          setPersons(persons.filter((person) => person.id !== id));
          setNotification({
            message: `The person was already removed from the server`,
            danger: true,
          });
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notification.message}
        danger={notification.danger}
      />
      <form>
        <div>
          filter show with
          <input
            type="text"
            name="search"
            value={searchField}
            onChange={searchPerson}
          />
        </div>
      </form>
      <Filter persons={persons} searchField={searchField} />
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name:{' '}
          <input
            name="personName"
            onChange={handleFormChange}
            value={formData.personName}
          />
        </div>
        <div>
          number:{' '}
          <input
            name="number"
            onChange={handleFormChange}
            value={formData.number}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person, i) => (
          <Person
            name={person.name}
            number={person.number}
            deletePerson={() => deletePerson(person.id)}
            key={i}
          ></Person>
        ))}
      </ul>
      {addingDuplcate ? <p>{lastEntry}</p> : <></>}
    </div>
  );
};

export default App;
