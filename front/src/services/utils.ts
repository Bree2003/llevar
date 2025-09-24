import { stringify } from "qs";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import MockApi from "./mockapi";

export interface AxiosResponse {
  data: any;
  status: number;
}

// DATA PERSISTANCE
export const saveOnSessionStorage = (key: string, value: any) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const deleteFromSessionStorage = (key: string) => {
  sessionStorage.removeItem(key);
};

export const getOnSessionStorage = (key: string): any => {
  return JSON.parse(sessionStorage.getItem(key) as any) || null;
};

export const ENV = process.env.ENVIRONMENT || 'dev';

const connectAxios = (axiosObj: AxiosInstance): AxiosInstance => {
  return MockApi(axiosObj, false);
};

export const AxiosGet = async (
  uri: string,
  params: {} = {}
): Promise<AxiosResponse> => {
  const options = (): AxiosRequestConfig => {
    return {
      responseType: "json",
      headers: getHeadersRequests(),
      params: stringify(params),
      validateStatus: () => true,
      timeout: 1200000,
    };
  };
  return await connectAxios(axios)
    .get(process.env.REACT_APP_BACKEND_URL + uri + `-${ENV}`, options())
    .then((response) => {
      return {
        status: response.status,
        data: response.data,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        status: error.status,
        data: error.message,
      };
    });
};

export const AxiosPost = (uri: string, body: {}): Promise<AxiosResponse> => {
  return connectAxios(axios)
    .post(process.env.REACT_APP_BACKEND_URL + uri + `-${ENV}`, body, {
      headers: getHeadersRequests(),
      validateStatus: () => true,
      timeout: 1200000,
    })
    .then((response) => {
      return {
        status: response.status,
        data: response.data,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        status: error.status,
        data: error.message,
      };
    });
};

export const AxiosURLGet = async (
  uri: string,
  params: {} = {},
  includeAuth: boolean = true,
): Promise<AxiosResponse> => {
  const options = (): AxiosRequestConfig => {
    return {
      responseType: "json",
      headers: includeAuth ? getHeadersRequests() : getBasicHeadersRequests(),
      params: stringify(params),
      validateStatus: () => true,
      timeout: 1200000,
    };
  };
  return await connectAxios(axios)
    .get(uri, options())
    .then((response) => {
      return {
        status: response.status,
        data: response.data,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        status: error.status,
        data: error.message,
      };
    });
};

export const AxiosURLPost = (uri: string, body: {}, includeAuth: boolean = true): Promise<AxiosResponse> => {
  return connectAxios(axios)
    .post(uri, body, {
      headers: includeAuth ? getHeadersRequests() : getBasicHeadersRequests(),
      validateStatus: () => true,
      timeout: 1200000,
    })
    .then((response) => {
      return {
        status: response.status,
        data: response.data,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        status: error.status,
        data: error.message,
      };
    });
};

export const AxiosDownload = (
  uri: string, 
  body: {}, 
  config?: {} // Nuevo argumento opcional para configuraciones adicionales
): Promise<AxiosResponse> => {
  return connectAxios(axios)
    .post(process.env.REACT_APP_BACKEND_URL + uri + `-${ENV}`, body, {
      headers: getHeadersRequests(),
      validateStatus: () => true,
      timeout: 1200000,
      ...config, // Fusiona las configuraciones adicionales si se proporcionan
    })
    .then((response) => {
      return {
        status: response.status,
        data: response.data,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        status: error.status,
        data: error.message,
      };
    });
};

export const AxiosPut = (uri: string, body: {}): Promise<AxiosResponse> => {
  return connectAxios(axios)
    .put(process.env.REACT_APP_BACKEND_URL + uri + `-${ENV}`, body, {
      headers: getHeadersRequests(),
      validateStatus: () => true,
      timeout: 1200000,
    })
    .then((response) => {
      return {
        status: response.status,
        data: response.data,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        status: error.status,
        data: error.message,
      };
    });
};

export const AxiosDelete = (uri: string, body: {}): Promise<AxiosResponse> => {
  return connectAxios(axios)
    .delete(process.env.REACT_APP_BACKEND_URL + uri + `-${ENV}`, {
      data: body,
      headers: getHeadersRequests(),
      validateStatus: () => true,
      timeout: 1200000,
    })
    .then((response) => {
      return {
        status: response.status,
        data: response.data,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        status: error.status,
        data: error.message,
      };
    });
};

export const getBasicHeadersRequests = () => {
  const optionsHeaders = {
    "Content-Type": "application/json",
  };
  return optionsHeaders;
};

export const getHeadersRequests = () => {
  const token = getOnSessionStorage("accessToken");
  const optionsHeaders = {
    Authorization: `Bearer ${token.toString()}`,
    "Content-Type": "application/json",
  };
  return optionsHeaders;
};
