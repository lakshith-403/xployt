/**
 * Class representing a network service for making HTTP requests.
 */
class Network {
    baseURL: string

    /**
     * Creates an instance of Network.
     *
     * @param {string} baseURL - The base URL for the network requests.
     */
    constructor(baseURL: string) {
        this.baseURL = baseURL
    }

    /**
     * Sends a GET request to the server to get the current user.
     *
     * @returns {Promise<Response>} A promise that resolves with the user data.
     */
    async getCurrentUser(): Promise<Response> {
        return this.sendHttpRequest('GET', '/api/user')
    }

    /**
     * Sends a POST request to the server to sign in a user.
     *
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {Promise<Response>} A promise that resolves with the user data.
     */
    async signIn(username: string, password: string): Promise<Response> {
        return this.sendHttpRequest('POST', '/api/signin', {
            username
            , password
        })
    }

    /**
     * Sends a POST request to the server to sign out the current user.
     *
     * @returns {Promise<Response>} A promise that resolves with the response data.
     */
    async signOut(): Promise<Response> {
        return this.sendHttpRequest('POST', '/api/signout')
    }

    /**
     * Sends an HTTP request using XMLHttpRequest.
     *
     * @param {string} method - The HTTP method (e.g., 'GET', 'POST').
     * @param {string} url - The URL endpoint for the request.
     * @param {object} [data={}] - The data to be sent with the request.
     * @returns {Promise<any>} A promise that resolves with the response data.
     */
    private sendHttpRequest = (method: string, url: string, data: object = {}): Promise<any> => {
        const xhr = new XMLHttpRequest()
        return new Promise((resolve, reject) => {
            xhr.withCredentials = true
            xhr.open(method, this.baseURL + url)
            xhr.responseType = 'json'

            if (data) {
                xhr.setRequestHeader('Content-Type', 'application/json')
            }

            xhr.onload = async () => {
                if (xhr.status >= 400) {
                    reject(new NetworkError(xhr.status, url, xhr.response))
                } else {
                    resolve(xhr.response)
                }
            }

            xhr.onerror = (event) => {
                reject(new NetworkError(xhr.status, url, xhr.responseText,
                    `XHR request failed: ${event}\n Type: ${event.type}: ${event.loaded} bytes transferred`))
            }

            xhr.send(JSON.stringify(data))
        })
    }
}

/**
 * Interface representing a network response.
 */
export interface Response {
    is_successful: boolean
    data?: object
    error?: string
    trace?: string
}

/**
 * Class representing a network error.
 */
export class NetworkError {
    statusCode: number
    url: string
    errorDescription?: string
    stackTrace?: string
    message?: string

    /**
     * Creates an instance of NetworkError.
     *
     * @param {number} statusCode - The HTTP status code of the error.
     * @param {string} url - The URL that caused the error.
     * @param {any} [data] - Additional data about the error.
     * @param {string} [message] - An optional error message.
     */
    constructor(statusCode: number, url: string, data?: any, message?: string) {
        this.statusCode = statusCode
        this.url = url
        this.message = message
        if (data) {
            try {
                this.errorDescription = data['error']
                this.stackTrace = data['trace']
            } catch (e: any) {
                this.stackTrace = e.stack
                this.errorDescription = "Failed to extract data from network error: " + e.message
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
        Description: ${this.errorDescription}\n
        StackTrace: ${this.stackTrace},
        Message: ${this.message}`
    }
}

const NETWORK = new Network("localhost:8001")
export default NETWORK