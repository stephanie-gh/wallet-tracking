import { boot } from 'quasar/wrappers';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.BASE_URL || 'https://fakestoreapi.com',
});

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { axios, api };
