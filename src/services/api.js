// Definições da API a ser consumida

import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: "http://10.10.80.68:3333"
});

// Intercepta uma request antes dela acontecer
// Verifica se existe um tojen no localStorage
// Existindo, adiciona o Header de Authorization
api.interceptors.request.use(async config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
