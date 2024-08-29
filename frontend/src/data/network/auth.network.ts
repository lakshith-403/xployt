import  NETWORK from "./network"
import { Response } from "./network"

export class AuthEndpoints {
  /**
   * Sends a GET request to the server to get the current user.
   *
   * @returns {Promise<Response>} A promise that resolves with the user data.
   */
  static async getCurrentUser(): Promise<Response> {
    return NETWORK.sendHttpRequest('GET', '/api/user')
  }

  /**
   * Sends a POST request to the server to sign in a user.
   *
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<Response>} A promise that resolves with the user data.
   */
  static async signIn(username: string, password: string): Promise<Response> {
    return NETWORK.sendHttpRequest('POST', '/api/signin', {
      username
      , password
    })
  }

  /**
   * Sends a POST request to the server to sign out the current user.
   *
   * @returns {Promise<Response>} A promise that resolves with the response data.
   */
  static async signOut(): Promise<Response> {
    return NETWORK.sendHttpRequest('POST', '/api/signout')
  }
}