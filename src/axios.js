import axios from 'axios'

const getAPI = axios.create({
  baseURL: 'https://moomap-server.herokuapp.com',
  // baseURL: 'http://172.17.0.2:5000',
  timeout: 0
})

export { getAPI }
