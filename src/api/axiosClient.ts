import axios, { AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from "axios";

const axiosClient = axios.create({
    baseURL: "http://192.168.200.56:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
        if (config.headers && typeof config.headers.set === "function") {
            (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
        } else if (config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => Promise.reject(error)
);

export default axiosClient;