import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/',
  timeout: 5000,
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    'Content-Type': 'application/json',
    'accept': 'application/json',
  },
})

const authAxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/auth/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json',
  },
})

export default axiosInstance

export { authAxiosInstance }
