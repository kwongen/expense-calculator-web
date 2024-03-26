import AxiosInstance from './AxiosInstance';

export const getCalculationMasterDataApi = async (userProfile) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};
    const data = {profileId : userProfile.profileId}
    return await AxiosInstance
        .post('/calculation/master-data', data, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("getCalculationMasterDataApi: ", error?.response?.data);
            return {error: error?.response?.data};
        });
}

export const getCalculationsApi = async (userProfile, eventId, filter={}) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};
    const data = {profileId : userProfile.profileId, eventId: eventId, filter:filter};

    return await AxiosInstance
        .post('/calculation/get', data, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("getCalculationsApi: ", error?.response?.data);
            return {error: error?.response?.data};
        });
}

export const extendShareCodeApi = async (userProfile, calculationId) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};
    const data = {profileId: userProfile.profileId, calculationId : calculationId };

    return await AxiosInstance
        .post('/calculation/extend-share-code', data, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("extendShareCodeExpiryApi: ", error?.response?.data);
            return {error: error?.response?.data};
        });
}

export const getSharedCalculationResultApi = async (eventId, calculationId, shareCode) => {
    const data = {eventId: eventId, calculationId : calculationId, shareCode: shareCode };

    return await AxiosInstance
        .post('/calculation/get-shared-result', data)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("getSharedCalculationResultApi: ", error?.response?.data);
            return {error: error?.response?.data};
        });
}

export const addCalculationApi = async (userProfile, calculationData) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};

    return await AxiosInstance
        .post('/calculation/add', calculationData, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("addCalculationApi: ", error?.response?.data);
            return {error: error?.response?.data};
        });
}

export const deactivateCalculationApi = async (userProfile, calculationId) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};
    const data = {profileId : userProfile.profileId,
                calculationId: calculationId}

    return await AxiosInstance
        .post('/calculation/deactivate', data, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("deactivateCalculationApi: ", error?.response?.data);
            return {error: error?.response?.data};
        });
}