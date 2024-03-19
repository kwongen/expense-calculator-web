import AxiosInstance from './AxiosInstance';

export const getExpenseMasterDataApi = async (userProfile) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};
    const data = {profileId : userProfile.profileId}
    return await AxiosInstance
        .post('/expense/master-data', data, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("getExpenseMasterDataApi: ", error?.response?.data);
            return {error: error?.response?.data};
        });
}

export const getExpenseApi = async (userProfile, eventId) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};
    const data = {profileId : userProfile.profileId, eventId: eventId}

    return await AxiosInstance
        .post('/expense/get', data, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("getExpenseApi: ", error?.response?.data);
            return {error: error?.response?.data};
        });
}

export const addExpenseApi = async (userProfile, expenseData) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};

    return await AxiosInstance
        .post('/expense/add', expenseData, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("addExpenseApi: ", error?.response?.data);
            return {error: error?.response?.data};
        });
}

export const updateExpenseApi = async (userProfile, expenseData) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};

    return await AxiosInstance
        .post('/expense/update', expenseData, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("updateExpenseApi: ", error?.response?.data);
            return {error: error?.response?.data};
        });
}

export const deactivateExpenseApi = async (userProfile, expenseId) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};
    const data = {profileId : userProfile.profileId,
                  expenseId: expenseId}

    return await AxiosInstance
        .post('/expense/deactivate', data, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("deactivateExpenseApi: ", error?.response?.data);
            return {error: error?.response?.data};
        });
}