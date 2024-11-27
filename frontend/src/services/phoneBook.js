import axios from 'axios';

const baseURL = '/api/persons';

const getPeople = () => {
  const request = axios.get(baseURL);
  // axios.get(baseURL).then((response) => response.data);
  return request.then((response) => response.data);
};

const addPerson = (newEntry) => {
  const request = axios.post(baseURL, newEntry);
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  const request = axios.delete(`${baseURL}/${id}`);
  return request.then((response) => response.data);
};

const updatePersonNumber = (id, newEntry) => {
  const request = axios.put(`${baseURL}/${id}`, newEntry);
  return request.then((response) => {
    console.log('==================================');
    console.log('response', response);
    console.log('==================================');
    return response.data;
  });
};

export default { getPeople, addPerson, deletePerson, updatePersonNumber };
