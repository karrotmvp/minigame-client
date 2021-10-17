import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;

// Fetch using Axios
export const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});
