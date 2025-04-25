import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // Ton URL de backend Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
