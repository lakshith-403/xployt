import NETWORK from './network';
import { Response } from './network';

export class AuthEndpoints {
  /**
   * Sends a GET request to the server to get the current user.
   *
   * @returns {Promise<Response>} A promise that resolves with the user data.
   */
  static async getCurrentUser(): Promise<Response> {
    return NETWORK.sendHttpRequest('GET', '/api/auth');
  }

  /**
   * Sends a POST request to the server to sign in a user.
   *
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<Response>} A promise that resolves with the user data.
   */
  static async signIn(email: string, password: string): Promise<Response> {
    return NETWORK.sendHttpRequest('POST', '/api/auth', {
      email,
      password,
    });
  }

  /**
   * Sends a POST request to the server to sign out the current user.
   *
   * @returns {Promise<Response>} A promise that resolves with the response data.
   */
  static async signOut(): Promise<Response> {
    return NETWORK.sendHttpRequest('DELETE', '/api/auth');
  }

  /**
   * Sends a PUT request to the server to register a user.
   *
   * @param {string} name - The name of the user.
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<Response>} A promise that resolves with the response data.
   */
  static async register(name: string, email: string, password: string): Promise<Response> {
    return NETWORK.sendHttpRequest('PUT', '/api/auth', {
      name,
      email,
      password,
    });
  }
}
