import AxiosInstance from './AxiosInstance';

export const getEventMasterDataApi = async (userProfile) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};
    const data = {profileId : userProfile.profileId}
    return await AxiosInstance
        .post('/event/master-data', data, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("getEventMasterDataApi: ", error?.response?.data);
            return {error: error?.response?.data};
        });
}

export const getEventApi = async (userProfile, eventId="") => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};
    let data = {profileId : userProfile.profileId}

    if(eventId !== "") {
        data = {...data, filter: {_id: eventId}}
    }

    return await AxiosInstance
        .post('/event/get', data, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("getEventApi: ", error?.response?.data);
            return {error: error?.response?.data};
        });
}

export const addEventApi = async (userProfile, eventData) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};

    return await AxiosInstance
        .post('/event/add', eventData, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("addEventApi: ", error?.response?.data);
            return {error: error?.response?.data};
        });
}

export const updateEventApi = async (userProfile, eventData) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};

    return await AxiosInstance
        .post('/event/update', eventData, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("updateEventApi: ", error?.response?.data);
            return {error: error?.response?.data};
        });
}

export const deactivateEventApi = async (userProfile, eventId) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};
    const data = {profileId : userProfile.profileId,
                  eventId: eventId}

    return await AxiosInstance
        .post('/event/deactivate', data, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("deactivateEventApi: ", error?.response?.data);
            return {error: error?.response?.data};
        });
}