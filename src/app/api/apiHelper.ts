import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getToken, removeAuthData } from '../auth/authentication';
import { push } from 'react-router-redux';
import { store } from '../../index';

interface QueryParams {
  [key: string]: string;
}

const headersWithToken = (headers = {}) => ({ ...headers, authorization: `${getToken()}` });

const handleError = (error: AxiosError) => {
  if (error.response) {
    return Promise.reject({
      status: error.response.status,
      message: (error.response.data && error.response.data.message)
        || error.response.statusText
        || error.message
    });
  }

  return Promise.reject({ message: error.message });
};

const request = (config: AxiosRequestConfig, withToken: boolean) => {
  const finalConfig = withToken ? { ...config, headers: headersWithToken(config.headers) } : config;
  return Axios.request(finalConfig)
    .catch(error => {
      if (error.response && [401, 403].includes(error.response.status)) {
        const { dispatch } = store;
        removeAuthData();
        dispatch(push('/login'));
      } else {
        throw error;
      }
    });
};

export const Get = (url: string, withToken: boolean = true, params?: QueryParams) => {
  const config = { url, params, method: 'get' };
  return request(config, withToken);
};

export const Put = (url: string, data: any, withToken: boolean = true, params?: QueryParams) => {
  const config = { url, params, method: 'put', data };
  return request(config, withToken);
};

export const Patch = (url: string, data: any, withToken: boolean = true, params?: QueryParams) => {
  const config = { url, params, method: 'patch', data };
  return request(config, withToken);
};

export const Post = (url: string, data: object, withToken: boolean = true, params?: QueryParams) => {
  const config = { url, params, method: 'post', data };
  return request(config, withToken);
};

export const Delete = (url: string, withToken: boolean = true, params?: QueryParams) => {
  const config = { url, params, method: 'delete' };
  return request(config, withToken);
};

const processOptions = (url, options) => {
  url = url + '?';
  Object.keys(options).forEach(option => {
    url = url + `&${option}=${options[option]}`
  });
  return encodeURI(url);
}

/**
 * supports crude queries that follow REST paradigm
 * @param resource
 */
export const api = (resource, rootUrl = '/api') => {
  const resourceUrl = `${rootUrl}/${resource.toLowerCase()}s`;
  return {
    get: async (id) => {
      return await Get(`${resourceUrl}/${id}`, true);
    },
    getAll: async (options) => {
      return await Get(processOptions(resourceUrl, options), true);
    },
    post: async (data) => {
      return await Post(`${resourceUrl}/`, data, true);
    },
    put: async (id, data) => {
      return await Put(`${resourceUrl}/${id}`, data, true);
    },
    delete: async (id) => {
      return await Delete(`${resourceUrl}/${id}`, true);
    }
  }
}
