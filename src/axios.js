import axios from "axios"

// Базовая ссылка для запросов
const instance = axios.create({
  // baseURL: "https://ragecloud.ru/api/",
  baseURL: "http://localhost:3002/api/",
})

instance.interceptors.request.use((config) => {
  return config
})

export default instance
