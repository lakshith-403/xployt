/**
 * Class representing a network service for making HTTP requests.
 */
class Network {
  baseURL: string;

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
  public sendHttpRequest = (method: string, url: string, data: any = {}, type: string = 'application/json'): Promise<any> => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    return new Promise((resolve, reject) => {
      // Validate method and URL
      if (!['GET', 'POST', 'PUT', 'DELETE'].includes(method.toUpperCase())) {
        return reject(new Error('Invalid HTTP method'));
      }
      if (!url || typeof url !== 'string') {
        return reject(new Error('Invalid URL'));
      }

      console.log(`Sending ${method} request to ${url}`);
      xhr.open(method, this.baseURL + url);

      if (type !== 'multipart/form-data') {
        xhr.setRequestHeader('Content-Type', type);
      }

      xhr.onload = () => {
        console.log(`Request to ${url} completed with status: ${xhr.status}`);
        if (xhr.status >= 400) {
          reject(new NetworkError(xhr.status, url, xhr.response));
        } else {
          try {
            const response = xhr.response ? JSON.parse(xhr.response) : null;
            resolve(response);
          } catch (e) {
            reject(new Error('Failed to parse JSON response'));
          }
        }
      };

      xhr.onerror = (event) => {
        reject(new NetworkError(xhr.status, url, null, `XHR request failed: ${event.type}`));
      };

      if (type === 'application/json') {
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send(data);
      }
    });
  };
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
    if (data) {
      try {
        this.errorDescription = data['error'];
        this.stackTrace = data['trace'];
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
