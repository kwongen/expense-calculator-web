import AxiosInstance from './AxiosInstance';

export const isSessionAlive = async () => {
    return AxiosInstance
        .post('/auth/refresh-token')
        .then(response => {
            return { isAlive: true, data: response.data }
        })
        .catch((error) => {
            console.log("isSessionAlive: invalid or expired session");
            return { isAlive: false };
        });
}

export const loginApi = async (credential) => {
    return AxiosInstance
        .post('/auth/login', credential)
        .then(response => {
//console.log("loginApi:", response)
            return response.data;
        })
        .catch((error) => {
            console.log("loginApi:", error);
            const errorMsg = (error.response && error.response.data) ? JSON.parse(error.response.data) : "Failed to register your google account. Please try again!"
            return {error: errorMsg};
        })
}

export const googleLoginApi = async (credential) => {
    return AxiosInstance
        .post('/auth/google-login', credential)
        .then(response => {
            return response.data;
        })
        .catch((error) => {            
            const errorMsg = (error.response && error.response.data) ? JSON.parse(error.response.data) : "Failed to register your google account. Please try again!"
            return {error: errorMsg};
        })
}

export const googleRegisterApi = async (credential, regcode) => {
    const data = {googleCredential:credential,regcode:regcode};

    return AxiosInstance
        .post('/auth/google-register', data)
        .then(response => {
            return response.data;
        })
        .catch((error) => {
            const errorMsg = (error.response && error.response.data) ? JSON.parse(error.response.data) : "Failed to register your google account. Please try again!"
            return {error: errorMsg};
        })
}

export const logoutApi = async () => {
    return AxiosInstance
        .post('/auth/logout')
        .then(response => {
            //console.log(response)
            return response.data;
        })
        .catch((error) => {
            console.log("logoutApi:", error.message);
            return null;
        })
}

export const registerApi = async (regData) => {
    return AxiosInstance
        .post('/auth/register', regData)
        .then(response => {
            //console.log(response)
            return response.data;
        })
        .catch((error) => {
            console.log("registerApi:", error?.response?.data);
            return null;
        })
}
