const Person = ({ name, number, deletePerson }) => (
  <li>
    {name} {number}
    {deletePerson ? <button onClick={deletePerson}>delete</button> : null}
  </li>
);

export default Person;
