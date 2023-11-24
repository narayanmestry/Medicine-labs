import axios from "axios";
import {baseUrl } from "../config/config";

const loginInstance = axios.create({
    baseURL: `${baseUrl}/api/`,
   headers: {
        "Content-Type": "application/json",
        withCredentials: true
    }
});

const publicInstance = axios.create({
    baseURL: `${baseUrl}`,
   headers: {
        "Content-Type": "application/json",
        timeout: 1000,
    }
});

// const instance = axios.create({
//     baseURL: `${baseUrl}/admin/`,
//     headers: {
//         "Content-Type": "application/json",
//         // Authorization: `${sessionStorage.getItem('token')}`,
//         withCredentials: true,
//     }
// });

const privateInstance = axios.create({
    baseURL:`${baseUrl}`,
    headers: {
        "Content-Type": "application/json",
        withCredentials: true,
    }
})

const apis = {
    loginInstance,
    // instance,
    publicInstance,
    privateInstance
}

export default apis;