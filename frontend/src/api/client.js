import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

let isRefreshing = false;
let refreshQueue = [];

function setTokens(accessToken, refreshToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
}

function clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}

function processQueue(error, token) {
    refreshQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
    });
    refreshQueue = [];
}

apiClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config;
        const status = error?.response?.status;

        if (status !== 401 || !originalRequest || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            clearTokens();
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                refreshQueue.push({ resolve, reject });
            }).then((newAccessToken) => {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            });
        }

        isRefreshing = true;
        try {
            const refreshResponse = await axios.post(
                `${BASE_URL}/api/auth/refresh`,
                {},
                { headers: { "x-refresh-token": refreshToken } }
            );

            const newAccessToken = refreshResponse.data.accessToken;
            const newRefreshToken = refreshResponse.data.refreshToken;

            setTokens(newAccessToken, newRefreshToken);
            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            clearTokens();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export const authApi = {
    register: (payload) => apiClient.post("/api/auth/register", payload),
    login: (payload) => apiClient.post("/api/auth/login", payload),
    me: () => apiClient.get("/api/auth/me")
};

export const productsApi = {
    getAll: () => apiClient.get("/api/products"),
    create: (payload) => apiClient.post("/api/products", payload),
    getById: (id) => apiClient.get(`/api/products/${id}`),
    update: (id, payload) => apiClient.put(`/api/products/${id}`, payload),
    remove: (id) => apiClient.delete(`/api/products/${id}`)
};
