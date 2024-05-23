import {getRefreshToken, getUnauthenticatedClient} from '.';

export const registerUserFn = async newUser => await getUnauthenticatedClient().post(`auth/register`, newUser);

export const loginUserFn = async user => await getUnauthenticatedClient().post(`auth/login`, user);

export const logoutUserFn = async () => await getUnauthenticatedClient().get(`auth/logout`, {
    headers: {
        Authorization: `bearer ${getRefreshToken()}`
    }
});

export const googleSignin = (credentialResponse) => {
    return new Promise((resolve, reject) => {
        console.log("googleSignin ...")
        getUnauthenticatedClient().post("/auth/google", credentialResponse).then((response) => {
            console.log(response)
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}