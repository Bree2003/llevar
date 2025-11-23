import axios from "axios";
import { Dispatch } from "redux";
import { SET_ERROR, SET_FILES, SET_LOADING, StorageActionTypes } from "store/models/storage";

const API_URL = "http://localhost:5000/api/storage";

export const listFiles = () => async (dispatch: Dispatch<StorageActionTypes>) => {
  dispatch({ type: SET_LOADING, payload: true });
  try {
    const res = await axios.get(`${API_URL}/list`);
    dispatch({ type: SET_FILES, payload: res.data });
  } catch (error: any) {
    dispatch({ type: SET_ERROR, payload: error.message });
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const uploadFile = (file: File, destination: string) => async (dispatch: Dispatch<StorageActionTypes>) => {
  dispatch({ type: SET_LOADING, payload: true });
  const formData = new FormData();
  formData.append("file", file);
  formData.append("destination", destination);

  try {
    await axios.post(`${API_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(listFiles() as any);
  } catch (error: any) {
    dispatch({ type: SET_ERROR, payload: error.message });
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const deleteFile = (filename: string) => async (dispatch: Dispatch<StorageActionTypes>) => {
  dispatch({ type: SET_LOADING, payload: true });
  try {
    await axios.delete(`${API_URL}/delete/${filename}`);
    dispatch(listFiles() as any);
  } catch (error: any) {
    dispatch({ type: SET_ERROR, payload: error.message });
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const downloadFile = async (filename: string) => {
  const res = await axios.get(`${API_URL}/download/${filename}`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
