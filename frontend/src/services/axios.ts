import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"

const API_URL = process.env.API_URL || "http://localhost:3000/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Token
export const setAxiosToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"]
  }
}

export class ApiClient {
  static async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.get(endpoint, config)
    return response.data
  }

  static async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.post(endpoint, data, config)
    return response.data
  }

  static async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.put(endpoint, data, config)
    return response.data
  }

  static async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.delete(endpoint, config)
    return response.data
  }
}

export default axiosInstance

 