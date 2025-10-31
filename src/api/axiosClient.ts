import axios, { AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL ;

const axiosClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
        if (config.headers instanceof AxiosHeaders) {
            config.headers.set("Authorization", `Bearer ${token}`);
        } else {
            (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
        }
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: unknown) => {
        if (error instanceof Error) {
            return Promise.reject(error);
        }
        const message = typeof error === "string" ? error : "Request failed";
        return Promise.reject(new Error(message));
    }
);

export default axiosClient;