import { BACKEND_URL } from "@/contants";
import axios from "axios";

const api = axios.create({
    baseURL: `${BACKEND_URL}/api/v1`,
    withCredentials: true
});


export const uploadHandler = async (formData) => await api.post('/upload',formData,{headers: {
    'Content-Type': 'multipart/form-data'
}})
export const loginRequest = async (email,password) => await api.post('/login',{email,password},{headers: {
    'Content-Type': 'application/json'
}})
export const changePasswordRequest = async (oldpassword, newpassword) => await api.post('/change-password',{oldpassword, newpassword},{headers: {
    'Content-Type': 'application/json'
}})
export const getAllDirectory = async () => await api.get('/get-folders')
export const getFile = async (path) => await api.get(`/get-file?path=${path}`)
export const getFileWithWordRequest = async (query) => await api.get(`/get-file-with-word?query=${query}`);
export const getFileWithDateRequest = async (date,enddate) => await api.get(`/get-file-with-date?date=${date}&enddate=${enddate}`);
export const loadUser = async () => await api.get(`/me`);
export const logoutRequest = async () => await api.get(`/logout`);