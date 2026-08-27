import { stringify } from "qs";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import MockApi from "./mockapi";

export interface AxiosResponse {
  data: any;
  status: number;
  headers?: any;
}

export const AxiosPostFormData = (uri: string, body: FormData): Promise<AxiosResponse> => {
  const token = getOnSessionStorage("accessToken");
  
  const optionsHeaders: { [key: string]: string } = {};

  if (token) {
    optionsHeaders['Authorization'] = `Bearer ${token.toString()}`;
  }

  return connectAxios(axios)
    .post(process.env.REACT_APP_BACKEND_URL + uri, body, {
      headers: optionsHeaders,
      validateStatus: () => true,
      timeout: 1200000,
    })
    .then((response) => ({ status: response.status, data: response.data }))
    .catch(function (error) {
      console.log(error);
      return { status: error.status, data: error.message };
    });
};

export const AxiosPutResumable = async (
  sessionUrl: string,
  file: File
): Promise<AxiosResponse> => {
  return await axios
    .put(sessionUrl, file, {
      headers: {
        'Content-Length': file.size.toString(),
      },
      validateStatus: () => true,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Progreso de subida: ${percentCompleted}%`);
        }
      },
    })
    .then((response) => ({
      status: response.status,
      data: response.data,
    }))
    .catch((error) => {
      console.error("Error en la subida directa a GCS:", error);
      return { status: error.response?.status || 500, data: error.message };
    });
};

export const AxiosPutSignedUrl = async (
  url: string,
  file: File,
  contentType: string
): Promise<AxiosResponse> => {
  return await axios
    .put(url, file, {
      headers: {
        'Content-Type': contentType,
      },
      validateStatus: () => true,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Progreso de subida: ${percentCompleted}%`);
        }
      },
    })
    .then((response) => ({
      status: response.status,
      data: response.data,
    }))
    .catch((error) => {
      console.error("Error en la subida directa a GCS:", error);
      return { status: error.response?.status || 500, data: error.message };
    });
};

export const saveOnSessionStorage = (key: string, value: any) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const deleteFromSessionStorage = (key: string) => {
  sessionStorage.removeItem(key);
};

export const getOnSessionStorage = (key: string): any => {
  return JSON.parse(sessionStorage.getItem(key) as any) || null;
};

export const ENV = process.env.REACT_APP_ENVIRONMENT || 'dev';

const connectAxios = (axiosObj: AxiosInstance): AxiosInstance => {
  return MockApi(axiosObj, false);
};

export const getBasicHeadersRequests = () => {
  return { "Content-Type": "application/json" };
};

export const getHeadersRequests = () => {
  const token = getOnSessionStorage("accessToken");
  return {
    Authorization: `Bearer ${token?.toString()}`,
    "Content-Type": "application/json",
  };
};

export const AxiosGet = async (uri: string, params: {} = {}): Promise<AxiosResponse> => {
  const options: AxiosRequestConfig = {
    responseType: "json",
    headers: getHeadersRequests(),
    params: params,
    validateStatus: () => true,
    timeout: 1200000,
  };
  
  return await connectAxios(axios)
    .get(process.env.REACT_APP_BACKEND_URL + uri, options)
    .then((response) => ({ status: response.status, data: response.data }))
    .catch((error) => {
      console.log(error);
      return { status: error.status, data: error.message };
    });
};

export const AxiosPost = (uri: string, body: {}): Promise<AxiosResponse> => {
  return connectAxios(axios)
    .post(process.env.REACT_APP_BACKEND_URL + uri, body, {
      headers: getHeadersRequests(),
      validateStatus: () => true,
      timeout: 1200000,
    })
    .then((response) => ({ status: response.status, data: response.data }))
    .catch((error) => {
      console.log(error);
      return { status: error.status, data: error.message };
    });
};

export const AxiosPostForm = (
  uri: string, 
  formData: FormData, 
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  
  const token = getOnSessionStorage("accessToken");
  
  const headers = {
    Authorization: `Bearer ${token?.toString()}`,
  };

  return connectAxios(axios)
    .post(process.env.REACT_APP_BACKEND_URL + uri, formData, {
      headers: headers, 
      validateStatus: () => true,
      timeout: 1200000,
      ...config,
    })
    .then((response) => ({ status: response.status, data: response.data }))
    .catch((error) => {
      console.log(error);
      return { status: error.status || 500, data: error.message };
    });
};

export const AxiosPut = (uri: string, body: {}): Promise<AxiosResponse> => {
  return connectAxios(axios)
    .put(process.env.REACT_APP_BACKEND_URL + uri, body, {
      headers: getHeadersRequests(),
      validateStatus: () => true,
      timeout: 1200000,
    })
    .then((response) => ({ status: response.status, data: response.data }))
    .catch((error) => {
      console.log(error);
      return { status: error.status, data: error.message };
    });
};

export const AxiosDelete = (uri: string, body: {}): Promise<AxiosResponse> => {
  return connectAxios(axios)
    .delete(process.env.REACT_APP_BACKEND_URL + uri, {
      data: body,
      headers: getHeadersRequests(),
      validateStatus: () => true,
      timeout: 1200000,
    })
    .then((response) => ({ status: response.status, data: response.data }))
    .catch((error) => {
      console.log(error);
      return { status: error.status, data: error.message };
    });
};

// --------------------------------------------------
// URL METHODS (EXTERNOS)
// --------------------------------------------------

export const AxiosURLGet = async (uri: string, params: {} = {}, includeAuth: boolean = true): Promise<AxiosResponse> => {
  const options: AxiosRequestConfig = {
    responseType: "json",
    headers: includeAuth ? getHeadersRequests() : getBasicHeadersRequests(),
    params: stringify(params),
    validateStatus: () => true,
    timeout: 1200000,
  };

  return await connectAxios(axios)
    .get(uri, options)
    .then((response) => ({ status: response.status, data: response.data }))
    .catch((error) => {
      console.log(error);
      return { status: error.status, data: error.message };
    });
};

export const AxiosURLPost = (uri: string, body: {}, includeAuth: boolean = true): Promise<AxiosResponse> => {
  return connectAxios(axios)
    .post(uri, body, {
      headers: includeAuth ? getHeadersRequests() : getBasicHeadersRequests(),
      validateStatus: () => true,
      timeout: 1200000,
    })
    .then((response) => ({ status: response.status, data: response.data }))
    .catch((error) => {
      console.log(error);
      return { status: error.status, data: error.message };
    });
};

export const AxiosURLPut = (
  uri: string,
  body: any,
  config: AxiosRequestConfig = {}, 
  includeAuth: boolean = false
): Promise<AxiosResponse> => {
  
  const baseHeaders = includeAuth ? getHeadersRequests() : getBasicHeadersRequests();

  const finalConfig: AxiosRequestConfig = {
    validateStatus: () => true,
    timeout: 0,
    ...config,
    headers: {
      ...baseHeaders,
      ...config.headers,
    },
  };

  return connectAxios(axios)
    .put(uri, body, finalConfig)
    .then((response) => ({ status: response.status, data: response.data }))
    .catch((error) => {
      console.log(error);
      return { status: error.status || 500, data: error.message };
    });
};

export const AxiosGetConfig = async (
  uri: string,
  params: {} = {},
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {

  const options: AxiosRequestConfig = {
    headers: getHeadersRequests(),
    params: params,
    validateStatus: () => true,
    timeout: 1200000,
    ...config,
  };

  return await connectAxios(axios)
    .get(process.env.REACT_APP_BACKEND_URL + uri, options)
    .then((response) => ({
      status: response.status,
      data: response.data,
      headers: response.headers,
    }))
    .catch((error) => {
      console.log(error);
      return { status: error.status, data: error.message };
    });
};