import LoadingScreen from '@components/loadingScreen/loadingScreen';
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';
import { UIManager } from '@/ui_lib/UIManager';

/**
 * Class representing a network service for making HTTP requests.
 */
class Network {
  baseURL: string;
  private cache: Map<string, { valid: boolean; response: any }> = new Map();

  /**
   * Creates an instance of Network.
   *
   * @param {string} baseURL - The base URL for the network requests.
   */
  constructor(baseURL: string) {
    this.baseURL = 'http://' + baseURL;
  }

  /**
   * Sends an HTTP request using XMLHttpRequest.
   *
   * @param {string} method - The HTTP method (e.g., 'GET', 'POST').
   * @param {string} url - The URL endpoint for the request.
   * @param {object} [data={}] - The data to be sent with the request.
   * @returns {Promise<any>} A promise that resolves with the response data.
   */
  public sendHttpRequest(method: string, url: string, data: any = {}, type: string = 'application/json'): Promise<any> {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    return new Promise((resolve, reject) => {
      // Validate method and URL
      if (!['GET', 'POST', 'PUT', 'DELETE'].includes(method.toUpperCase())) {
        return reject(new NetworkError(0, url, null, 'Invalid HTTP method'));
      }
      if (!url || typeof url !== 'string') {
        return reject(new NetworkError(0, url, null, 'Invalid URL'));
      }

      console.log(`Sending ${method} request to ${url}`);
      xhr.open(method, this.baseURL + url);

      if (type !== 'multipart/form-data') {
        xhr.setRequestHeader('Content-Type', type);
      }

      xhr.onload = () => {
        console.log(`Request to ${url} completed with status: ${xhr.status}`);
        // console.log(xhr.response);
        if (xhr.status >= 400) {
          // console.log('> 400');
          reject(new NetworkError(xhr.status, url, xhr.response));
        } else {
          try {
            const response = xhr.response ? JSON.parse(xhr.response) : null;
            // console.log('response', response);
            if (method === 'GET') {
              this.cache.set(url, { valid: true, response });
            }
            resolve(response);
          } catch (e) {
            reject(new NetworkError(xhr.status, url, null, 'Failed to parse JSON response'));
          }
        }
      };

      xhr.onerror = (event) => {
        console.log('XHR request failed: ' + event.type);
        reject(new NetworkError(xhr.status, url, null, `XHR request failed: ${event.type}`));
      };

      if (type === 'application/json') {
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send(data);
      }
    });
  }

  private recognizedOptions = ['showLoading', 'handleError', 'throwError', 'showSuccess', 'successCallback']; // Define recognized options

  private normalizeOptions(options: any): { showLoading: boolean; handleError: boolean; throwError: boolean; showSuccess: boolean; successCallback: () => void } {
    const defaultOptions = { showLoading: true, handleError: true, throwError: true, showSuccess: false, successCallback: () => {} };

    // Check if any unrecognized option is set
    Object.keys(options).forEach((key) => {
      if (!this.recognizedOptions.includes(key)) {
        console.error(`Unrecognized option in network options`);
        throw new Error(`Unrecognized option`);
      }
      // console.log('key was good:', key);
    });

    return { ...defaultOptions, ...options }; // Merge with defaults
  }

  private async handleRequest(method: string, url: string, data: any = {}, options: any = {}): Promise<any> {
    let normalizedOptions: any;
    try {
      normalizedOptions = this.normalizeOptions(options);
    } catch (error: any) {
      console.error(`Error catched in handleRequest: ${method}:`, error);
      throw error;
    }

    if (method === 'GET' && this.cache.has(url) && this.cache.get(url)?.valid) {
      return this.cache.get(url)?.response;
    }

    if (['POST', 'PUT', 'DELETE'].includes(method)) {
      this.cache.delete(url);
    }

    if (normalizedOptions.showLoading) {
      UIManager.showLoadingScreen();
    }

    try {
      const response = await this.sendHttpRequest(method, url, data, 'application/json');
      if (normalizedOptions.showSuccess) {
        UIManager.showSuccessModal(response.title, response.message, normalizedOptions.successCallback);
      }
      return response;
    } catch (error: any) {
      console.error(`Error catched in handleRequest: ${method}:`, error);
      if (normalizedOptions.handleError) {
        UIManager.showErrorModal(method, url, error);
        if (normalizedOptions.throwError) {
          throw error;
        }
      } else {
        throw error;
      }
    } finally {
      if (normalizedOptions.showLoading) {
        UIManager.hideLoadingScreen();
      }
    }
  }

  public async get(url: string, options: any = {}): Promise<any> {
    return this.handleRequest('GET', url, {}, options);
  }

  public async post(url: string, data: any, options: any = {}): Promise<any> {
    return this.handleRequest('POST', url, data, options);
  }

  public async put(url: string, data: any, options: any = {}): Promise<any> {
    return this.handleRequest('PUT', url, data, options);
  }

  public async delete(url: string, options: any = {}): Promise<any> {
    return this.handleRequest('DELETE', url, {}, options);
  }

  invalidateCache(url: string): void {
    console.log('invalidating cache for', url);
    try {
      const regex = new RegExp(url);
      console.log('regex', regex);
      const keysToInvalidate = Array.from(this.cache.keys()).filter((cacheUrl) => regex.test(cacheUrl));
      console.log('keysToInvalidate', keysToInvalidate);
      keysToInvalidate.forEach((key) => this.cache.delete(key));
    } catch (error) {
      console.error('Error invalidating cache:', error);
    }
  }
}

/**
 * Interface representing a network response.
 */
export interface Response {
  is_successful: boolean;
  data?: object;
  error?: string;
  trace?: string;
}

/**
 * Class representing a network error.
 */
export class NetworkError {
  statusCode: number;
  url: string;
  errorDescription?: string;
  stackTrace?: string;
  message?: string;

  servlet?: string; // The servlet that handled the request
  uri?: string; // The URI of the request
  code?: string; // The code of the error
  data?: any; // The data from the server

  /**
   * Creates an instance of NetworkError.
   *
   * @param {number} statusCode - The HTTP status code of the error.
   * @param {string} url - The URL that caused the error.
   * @param {any} [data] - Additional data about the error.
   * @param {string} [message] - An optional error message.
   */
  constructor(statusCode: number, url: string, data?: any, message?: string) {
    this.statusCode = statusCode;
    this.url = url;
    this.message = message;
    // console.log('data', data);
    if (data) {
      try {
        if (typeof data === 'string') {
          // console.log('Data is a string. Attempting to parse as JSON...');
          data = JSON.parse(data); // Parse the JSON string into an object
        }

        this.errorDescription = data['error'];
        this.stackTrace = data['trace'];
        this.message = data['message'];
        // this.uri = data['uri'];
        this.code = data['code'];
        this.servlet = data['servletClass'];
        this.data = data['data'];
        // console.log('this.data', this.data);
        // console.log('this.message', this.message);
        // console.log('this.errorDescription', this.errorDescription);
        // console.log('this.stackTrace', this.stackTrace);
        // console.log('this.uri', this.uri);
        // console.log('this.code', this.code);
        // console.log('this.servlet', this.servlet);
      } catch (e: any) {
        this.stackTrace = e.stack;
        this.errorDescription = 'Failed to extract data from network error: ' + e.message;
      }
    }
  }

  /**
   * Returns a string representation of the network error.
   *
   * @returns {string} A string describing the network error.
   */
  toString(): string {
    return `Status Code: ${this.statusCode}\n
        URL: ${this.url}\n
        Description: ${this.errorDescription || 'No description'}\n
        StackTrace: ${this.stackTrace || 'No stack trace'}\n
        Message: ${this.message || 'No message'}`;
  }
}

const NETWORK = new Network('localhost:8080');
export default NETWORK;
