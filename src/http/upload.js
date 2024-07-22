import { BACKEND_URL } from "@/contants";
import axios from "axios";

const api = axios.create({
    baseURL: `${BACKEND_URL}/api/v1`
});


export const uploadHandler = async (formData) => await api.post('/upload',formData,{headers: {
    'Content-Type': 'multipart/form-data'
}})
export const getAllDirectory = async () => await api.get('/get-folders')
export const getFile = async (path) => await api.get(`/get-file?path=${path}`)
export const getFileWithWordRequest = async (query) => await api.get(`/get-file-with-word?query=${query}`);
export const getFileWithDateRequest = async (date) => await api.get(`/get-file-with-date?date=${date}`);