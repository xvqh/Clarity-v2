export interface AxiosRequest {
    url: string;
    method: string;
    data?: any;
    headers?: any;
    params?: any;
    responseType?: string;
}
export interface AxiosResponse {
    status: number;
    statusText: string;
    headers: any;
    config: any;
    data?: any;
}
export interface AxiosError extends Error {
    response: AxiosResponse;
    request: AxiosRequest;
    toJSON: () => any;
    name: string;
    message: string;
    stack: string;
    code: string;
    isAxiosError: boolean;
    toString: () => string;
    [key: string]: any;
    [key: number]: any;
    [Symbol.toStringTag]: string;
    [Symbol.for("nodejs.util.inspect.custom")]: () => string;
}
export interface AxiosInstance {
    (config: AxiosRequest): Promise<AxiosResponse>;
    (url: string, config?: AxiosRequest): Promise<AxiosResponse>;
    (url: string, data?: any, config?: AxiosRequest): Promise<AxiosResponse>;
}
export interface AxiosStatic {
    new (instance: AxiosInstance): AxiosInstance;
    (config: AxiosRequest): Promise<AxiosResponse>;
    (url: string, config?: AxiosRequest): Promise<AxiosResponse>;
    (url: string, data?: any, config?: AxiosRequest): Promise<AxiosResponse>;
    create(config: AxiosRequest): AxiosInstance;
    create(url: string, config?: AxiosRequest): AxiosInstance;
    create(url: string, data?: any, config?: AxiosRequest): AxiosInstance;
    defaults: AxiosRequestConfig;
    CancelToken: CancelToken;
    Cancel: Cancel;
    all(promises: Array<Promise<AxiosResponse>>): Promise<AxiosResponse[]>;
}
export interface AxiosRequestConfig {
    url?: string;
    method?: string;
    baseURL?: string;
    data?: any;
    headers?: any;
    params?: any;
    timeout?: number;
}
export interface AxiosResponseConfig {
    url?: string;
    status?: number;
    statusText?: string;
    headers?: any;
    config?: AxiosRequestConfig;
    data?: any;
    request?: any;
    response?: AxiosResponse;
    isAxiosError?: boolean;
    toJSON?: () => any;
    toString?: () => string;
    [propName: string]: any;
    [propName: number]: any;
    [propName: symbol]: any;
    [propName: boolean]: any;
    [propName: undefined]: any;
    [propName: null]: any;
    [propName: Function]: any;
    [propName: object]: any;
    [propName: any]: any;
}
export interface AxiosErrorConfig {
    message?: string;
    config?: AxiosRequestConfig;
    code?: string;
    request?: any;
    response?: AxiosResponse;
    isAxiosError?: boolean;
    toJSON?: () => any;
    toString?: () => string;
    [propName: string]: any;
    [propName: number]: any;
    [propName: symbol]: any;
    [propName: boolean]: any;
    [propName: undefined]: any;
    [propName: null]: any;
    [propName: Function]: any;
    [propName: object]: any;
    [propName: any]: any;
    name: string;
}
export interface Cancel {
    message: string;
}
export interface CancelTokenSource {
    token: CancelToken;
    cancel: Cancel;
}
export interface CancelToken {
    promise: Promise<Cancel>;
    throwIfRequested: () => void;
}


