import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://172.27.101.83'
})

export default instance
