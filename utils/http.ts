import axios from "axios";
import { useAuthStore } from "../stores/auth";

export const HTTP = axios.create({
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
});

HTTP.interceptors.request.use((config) => {
    const token = useAuthStore().accessToken;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

HTTP.interceptors.response.use(
    (response) => {
        if (response.data.alert && response.data.alert.title) {
            $useToast(response.data.alert);
        }
        else if (response.data.message) {
            $useToast({
                title: response.data.statusCode > 299 ? 'Erreur' : 'Succès',
                type: response.data.statusCode > 299 ? 'error' : 'success',
                message: response.data.message
            });
        }
        return response;
    },
    (error) => {
        if (error.response && error.response.data.message) {
            $useToast({
                title: 'Erreur',
                type: 'error',
                message: error.response.data.message
            });
        }
        return Promise.reject(error);
    }
);
