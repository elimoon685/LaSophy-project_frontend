import axios from 'axios';
import Cookies from 'js-cookie'
import { InternalAxiosRequestConfig } from 'axios';



export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LASOPHY_BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiComment=axios.create({
      baseURL: process.env.NEXT_PUBLIC_LASOPHY_COMMENT_BACKEND_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
});
export const apiUpload=axios.create({
     baseURL: process.env.NEXT_PUBLIC_LASOPHY_UPLOAD_BACKEND_API_URL
})

export const apiBook=axios.create({
     baseURL:process.env.NEXT_PUBLIC_LASOPHY_BOOK_BACKEND_API_URL,
     headers: {
      'Content-Type': 'application/json',
    },
})
export const apiNotification=axios.create({
  baseURL:process.env.NEXT_PUBLIC_LASOPHY_NOTIFICATION_BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
export const apiPayment=axios.create({
  baseURL:process.env.NEXT_PUBLIC_LASOPHY_PAYMENT_BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
/*
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);l
    }
);
*/
const attachToken = (config:InternalAxiosRequestConfig):InternalAxiosRequestConfig=> {
  const token = Cookies.get('token');
  if (token) {
    config.headers = config.headers || {}; 
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};
apiClient.interceptors.request.use(attachToken, (error) => Promise.reject(error));
apiComment.interceptors.request.use(attachToken, (error) => Promise.reject(error));
apiBook.interceptors.request.use(attachToken, (error) => Promise.reject(error));
apiUpload.interceptors.request.use(attachToken, (error) => Promise.reject(error));
apiNotification.interceptors.request.use(attachToken, (error) => Promise.reject(error));




