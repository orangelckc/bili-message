import axios from 'axios'
import axiosTauriApiAdapter from 'axios-tauri-api-adapter'

const client = axios.create({
  adapter: axiosTauriApiAdapter,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Referer': 'https://www.bilibili.com/',
  },
})

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
