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
      // 2. Le pasamos el objeto de parámetros directamente a Axios.
      //    Axios se encargará de convertirlo a un string de query.
      params: params,
      validateStatus: () => true,
      timeout: 1200000,
    };
  };
   return await connectAxios(axios)
    // Usamos la URL base del backend desde las variables de entorno
    .get(process.env.REACT_APP_BACKEND_URL + uri, options())
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
    .post(process.env.REACT_APP_BACKEND_URL + uri, body, {
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

export const AxiosPostForm = (uri: string, formData: FormData): Promise<AxiosResponse> => {
  // Obtenemos el token de la misma forma, pero no seteamos Content-Type
  // El navegador lo hará automáticamente por nosotros y añadirá el boundary correcto.
  const token = getOnSessionStorage("accessToken");
  const headers = {
    Authorization: `Bearer ${token.toString()}`,
  };

  return connectAxios(axios)
    .post(process.env.REACT_APP_BACKEND_URL + uri, formData, {
      headers: headers,
      validateStatus: () => true,
      timeout: 1200000, // Un timeout largo es bueno para subidas de archivos
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

export const AxiosPostFormData = (uri: string, body: FormData): Promise<AxiosResponse> => {
  const token = getOnSessionStorage("accessToken");
  
  // Creamos un objeto de cabeceras explícito
  const optionsHeaders: { [key: string]: string } = {};

  // Solo añadimos la cabecera de autorización SI el token existe
  if (token) {
    optionsHeaders['Authorization'] = `Bearer ${token.toString()}`;
  }
  // IMPORTANTE: No añadimos 'Content-Type', el navegador lo hace por nosotros para FormData

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

export const AxiosURLGet = async (
  uri: string,
  params: {} = {},
  includeAuth: boolean = true,
): Promise<AxiosResponse> => {
  const options = (): AxiosRequestConfig => {
    return {
      responseType: "json",
      headers: includeAuth ? getHeadersRequests() : getBasicHeadersRequests(),
      // Mismo cambio aquí: pasamos el objeto directamente.
      params: params,
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
    .post(process.env.REACT_APP_BACKEND_URL + uri, body, {
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
    .put(process.env.REACT_APP_BACKEND_URL + uri, body, {
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
    .delete(process.env.REACT_APP_BACKEND_URL + uri, {
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

export const AxiosPutResumable = async (
  sessionUrl: string,
  file: File
): Promise<AxiosResponse> => {
  return await axios
    .put(sessionUrl, file, {
      headers: {
        // Esta cabecera es OBLIGATORIA para las subidas reanudables.
        'Content-Length': file.size.toString(),
      },
      validateStatus: () => true,
      // Incluimos el progreso de subida, muy útil para archivos grandes
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
      // GCS devuelve un 200 en éxito con un cuerpo vacío.
      status: response.status,
      data: response.data,
    }))
    .catch((error) => {
      console.error("Error en la subida directa a GCS:", error);
      return { status: error.response?.status || 500, data: error.message };
    });
  };

export const getHeadersRequests = () => {
  const token = getOnSessionStorage("accessToken");
  
  // Definimos un tipo para las cabeceras para mayor seguridad
  const optionsHeaders: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  // Solo añadimos la cabecera de autorización SI el token existe
  if (token) {
    optionsHeaders['Authorization'] = `Bearer ${token.toString()}`;
  }

  return optionsHeaders;
};

export const AxiosPutSignedUrl = async (
  url: string,
  file: File,
  contentType: string
): Promise<AxiosResponse> => {
  return await axios
    .put(url, file, {
      headers: {
        // La cabecera Content-Type DEBE coincidir con la que se usó para generar la URL
        'Content-Type': contentType,
      },
      validateStatus: () => true,
      // Opcional: para monitorear el progreso de la subida
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Progreso de subida: ${percentCompleted}%`);
        }
      },
    })
    .then((response) => ({
      // GCS devuelve un 200 en éxito, no devuelve un cuerpo.
      status: response.status,
      data: response.data,
    }))
    .catch((error) => {
      console.error("Error en la subida directa a GCS:", error);
      return { status: error.response?.status || 500, data: error.message };
    });
};
