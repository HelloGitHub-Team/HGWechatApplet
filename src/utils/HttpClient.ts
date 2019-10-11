import { buildFullPath } from "./url";
import InterceptorManager, { Interceptor } from "./InterceptorManager";

type WxOption = WechatMiniprogram.RequestOption;

export interface HttpResponse<T = any> {
  data: T;
  header: Record<string, any>;
  statusCode: number;
  errMsg: string;
}

export interface Options {
  url?: string;
  data?: WxOption["data"];
  method?: WxOption["method"];
  header?: WxOption["header"];
  dataType?: WxOption["dataType"];
  responseType?: WxOption["responseType"];
}

export interface IHttpClient {
  readonly baseUrl: string;

  interceptors: {
    request: InterceptorManager<Options>;
    response: InterceptorManager<HttpResponse>;
  };
}

export interface IHttpConfig {
  baseUrl?: string;
  errorHandler?: Function;
  successHandler?: Function;
}

type RequestInterceptor = Interceptor<Options>;
type ResponseInterceptor = Interceptor<HttpResponse>;

export default class HttpClient implements IHttpClient {
  readonly baseUrl: string;

  interceptors: IHttpClient["interceptors"];

  constructor(config?: IHttpConfig) {
    const { baseUrl } = config;

    this.baseUrl = baseUrl;

    this.interceptors = {
      request: new InterceptorManager<Options>(),
      response: new InterceptorManager<HttpResponse>()
    };
  }

  dispatchRequest<T>(options: Options): Promise<HttpResponse<T>> {
    const fullPath = buildFullPath(this.baseUrl, options.url);

    return new Promise(function dispatchWxRequest(resolve, reject) {
      const success = (response: HttpResponse<T>) => {
        // console.log("HTTP service Success -> ", fullPath, response);
        resolve(response);
      };

      const fail = (error: any) => {
        // console.log("HTTP service Error -> ", fullPath, error);
        reject(error);
      };

      wx.request({ ...options, url: fullPath, fail, success });
    });
  }

  async request<T = any>(options: Options): Promise<HttpResponse<T>> {
    // Before request
    const before: Array<
      | ReturnType<RequestInterceptor["rejected"]>
      | ReturnType<RequestInterceptor["fulfilled"]>
    > = [];

    this.interceptors.request.each(interceptor => {
      before.push(interceptor.fulfilled, interceptor.rejected);
    });

    // After request
    const after: Array<
      | ReturnType<ResponseInterceptor["fulfilled"]>
      | ReturnType<ResponseInterceptor["rejected"]>
    > = [];

    this.interceptors.response.each(interceptor => {
      after.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promiseBefore = Promise.resolve(options);

    while (before.length) {
      promiseBefore = promiseBefore.then(before.shift(), before.shift());
    }

    const config = await promiseBefore;
    // console.log("Http Config -> ", config);

    // Dispatch request
    const response = await this.dispatchRequest<T>(config);

    let promiseAfter = Promise.resolve(response);

    while (after.length) {
      promiseAfter = promiseAfter.then(after.shift(), after.shift());
    }

    const result = await promiseAfter;

    return result;
  }

  get<T>(url: string, opts?: Options): Promise<HttpResponse<T>> {
    return this.request<T>({ ...opts, url, method: "GET" });
  }

  put<T>(url: string, opts?: Options): Promise<HttpResponse<T>> {
    return this.request<T>({ ...opts, url, method: "PUT" });
  }

  post<T>(url: string, opts?: Options): Promise<HttpResponse<T>> {
    return this.request<T>({ ...opts, url, method: "POST" });
  }

  delete<T>(url: string, opts?: Options): Promise<HttpResponse<T>> {
    return this.request<T>({ ...opts, url, method: "DELETE" });
  }
}
