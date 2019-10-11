import config from "@/config";
import HttpClient, { Options } from "./HttpClient";
import { API_SUCCESS_CODE } from "@constant/api";

interface ApiBaseResponse<T = any> {
  payload: T;
  code?: number;
  message?: string;
}

interface Pages {
  has_more: boolean;
  current_page: number;
}

type ApiPromise<T = ApiBaseResponse> = Promise<T>;

export type Response<T> = ApiBaseResponse<T>;
export type WithPage<T> = ApiBaseResponse<T> & Pages;

class Api {
  _http: HttpClient;

  constructor() {
    const { API_BASE_URL, API_TOKEN } = config;
    const http = new HttpClient({ baseUrl: API_BASE_URL });

    http.interceptors.request.use(config => {
      const { method, data } = config;

      // GET 请求 参数格式化
      if (method === "GET" && data) {
        config.url += `?q=${JSON.stringify(data)}`;
        delete config.data;
      }

      // 注入 Token
      config.header = {
        ...config.header,
        Authorization: API_TOKEN
      };

      return config;
    });

    http.interceptors.response.use(response => {
      const { statusCode } = response;

      if (statusCode !== API_SUCCESS_CODE) {
        return Promise.reject(response.data);
      } else {
        return Promise.resolve(response);
      }
    });

    this._http = http;
  }

  public async get<T>(url: string, config?: Options): ApiPromise<T> {
    const response = await this._http.get<T>(url, config);

    return response.data;
  }

  public async put<T>(url: string, config?: Options): ApiPromise<T> {
    const response = await this._http.put<T>(url, config);

    return response.data;
  }

  public async post<T>(url: string, config?: Options): ApiPromise<T> {
    const response = await this._http.post<T>(url, config);

    return response.data;
  }

  public async delete<T>(url: string, config?: Options): ApiPromise<T> {
    const response = await this._http.delete<T>(url, config);

    return response.data;
  }
}

export default new Api();
