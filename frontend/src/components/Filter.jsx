import Person from './Person';

const Filter = ({ persons, searchField }) => {
  if (searchField === '') {
    return '';
  }
  const filteredPersons = persons
    .filter((person) =>
      person.name.toLowerCase().includes(searchField.toLowerCase())
    )
    .map((person, i) => {
      return (
        <Person name={person.name} number={person.number} key={i}></Person>
      );
    });

  return <>{filteredPersons}</>;
};

export default Filter;
