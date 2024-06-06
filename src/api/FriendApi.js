import AxiosInstance from './AxiosInstance';

export const getFriendsApi = async (userProfile) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};
    const data = {profileId : userProfile.profileId}
    return await AxiosInstance
        .post('/friend/get', data, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("getFriendsApi: ", error.response.data);
            return {error: error.response.data};
        });
}

export const getFlattenedFriendsApi = async (userProfile, showActiveOnly=true) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};
    const data = {profileId : userProfile.profileId, showActiveOnly: showActiveOnly}
    return await AxiosInstance
        .post('/friend/get-flattened', data, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("getFlattenedFriendsApi: ", error.response.data);
            return {error: error.response.data};
        });
}

export const addFriendsApi = async (userProfile, friendsAr) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};
    const data = {profileId : userProfile.profileId,
                  friends: friendsAr}
    return await AxiosInstance
        .post('/friend/add', data, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("addFriendsApi: ", error.response.data);
            return {error: error.response.data};
        });
}

export const updateFriendApi = async (userProfile, friend) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};
    const data = {profileId : userProfile.profileId,
                  friend: friend}
    return await AxiosInstance
        .post('/friend/update', data, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("updateFriendApi: ", error.response.data);
            return {error: error.response.data};
        });
}

export const deactivateFriendApi = async (userProfile, friendId) => {
    const header = {headers: {"Authorization" : "Bearer " + userProfile.accessToken}};
    const data = {profileId : userProfile.profileId,
                  friendId: friendId}

    return await AxiosInstance
        .post('/friend/deactivate', data, header)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.log("deactivateFriendApi: ", error.response.data);
            return {error: error.response.data};
        });
}
                    