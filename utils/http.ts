import axios from "axios";

export const HTTP = axios.create({
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
});

HTTP.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${window.$userToken}`;
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
        if (error.response.data.message) {
            $useToast({
                title: 'Erreur',
                type: 'error',
                message: error.response.data.message
            });
        }

        return Promise.reject(error);
    }
);
