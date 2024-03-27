import AxiosInstance from './AxiosInstance';

export const editProfileApi = async (userProfile, profileData) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};

    return AxiosInstance
        .post('/user/edit-profile', profileData, header)
        .then(response => {
            return response.data;
        })
        .catch((error) => {
            console.log("editProfileApi: ", error?.response?.data);
            return {error: error?.response?.data};
        })
}

export const changePasswordApi = async (userProfile, changePasswordData) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};

    return AxiosInstance
        .post('/user/change-password', changePasswordData, header)
        .then(response => {
            return response.data;
        })
        .catch((error) => {
            console.log("changePasswordApi: ", error?.response?.data);
            return {error: error?.response?.data};
        })
}