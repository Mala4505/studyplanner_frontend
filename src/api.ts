import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000' });

export const createBook = (data) => API.post('/books/', data);
export const saveSchedule = (blocks) => API.post('/schedule/save/', blocks);
export const getSchedule = () => API.get('/schedule/');
export const updateBlock = (id, date_gregorian) =>
  API.patch('/schedule/update/', { id, date_gregorian });

