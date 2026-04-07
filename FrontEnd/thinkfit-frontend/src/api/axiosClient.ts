// src/api/axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Cổng mặc định của Spring Boot
  headers: { 'Content-Type': 'application/json' }
});

export default axiosClient;