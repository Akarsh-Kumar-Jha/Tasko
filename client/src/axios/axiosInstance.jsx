import axios from "axios";
import { toast } from "sonner";


const axiosInstance = axios.create({
  baseURL: 'https://tasko-backendnew.onrender.com/api/v1',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (res) => res,
    async(error) => {
        const originalRequest = error.config;
        if(error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try {
                await axiosInstance.post('/user/refresh-token');
               return axiosInstance(originalRequest);
            } catch (refreshError) {
                toast.error("Token Expired Please Login again");
                window.location.href = '/signup';
                return Promise.reject(refreshError)
            }
        }

       return Promise.reject(error);
    }
)

export default axiosInstance;
