import axios from "axios";

// Create an Axios instance with base API URL
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Automatically attach access token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Automatically refresh token if 401 Unauthorized is received
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and this is the first retry attempt
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          // Call refresh token endpoint
          const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: refreshToken,
          });

          const newAccessToken = res.data.access;
          localStorage.setItem("access_token", newAccessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error("🔒 Token refresh failed:", refreshError);
        }
      }

      // If refresh fails or doesn't exist, redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Proactively refresh the token before it expires
const scheduleTokenRefresh = () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return;

  // Decode the refresh token to get its expiration time
  const tokenPayload = JSON.parse(atob(refreshToken.split(".")[1]));
  const expirationTime = tokenPayload.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();

  // Schedule a refresh 1 minute before the token expires
  const refreshTime = expirationTime - currentTime - 60000;
  if (refreshTime > 0) {
    setTimeout(async () => {
      try {
        const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem("access_token", newAccessToken);
        scheduleTokenRefresh(); // Schedule the next refresh
      } catch (error) {
        console.error("🔒 Token refresh failed:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }, refreshTime);
  }
};

// Start the token refresh process when the app loads
scheduleTokenRefresh();

export default apiClient;
