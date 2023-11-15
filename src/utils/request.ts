import axios from 'axios'
import axiosTauriApiAdapter from 'axios-tauri-api-adapter'

const client = axios.create({ adapter: axiosTauriApiAdapter })

client.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => {
    console.error(err)
  },
)

client.interceptors.response.use(
  (response) => {
    return response.data
  },
  (err) => {
    return Promise.reject(err)
  },
)

export default client
