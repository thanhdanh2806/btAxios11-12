function APIGetUsers(searchTerm) {
    return axios({
        url: "https://6300bfa9290d71b581e22ea5.mockapi.io/products",
        method: "GET",
        params: {
            hoTen: searchTerm
        }
    });
}

function APIAddUser(user) {
    return axios({
        url: "https://6300bfa9290d71b581e22ea5.mockapi.io/products",
        method: "POST",
        data: user,
    });
}

function APIDeleteUser(userID) {
    return axios({
        url: `https://6300bfa9290d71b581e22ea5.mockapi.io/products/${userID}`,
        method: "DELETE",
    });
}

function APIGetUserByID(userID) {
    return axios({
        url: `https://6300bfa9290d71b581e22ea5.mockapi.io/products/${userID}`,
        method: "GET",
    });
}

function APIUpdateUser(userID , user) {
    return axios({
        url: `https://6300bfa9290d71b581e22ea5.mockapi.io/products/${userID}`,
        method: "PUT",
        data: user,
    });
}