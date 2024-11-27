import { CACHE_STORE } from '@/data/cache';
import NETWORK from '../../network/network';
/**
 * Sends the project configuration form data to the backend.
 *
 * @param {any} formData - The form data to send.
 * @returns {Promise<void>} A promise that resolves when the request is complete.
 */
export async function requestProject(formData: any): Promise<void> {
  try {
    const clientCache = await CACHE_STORE.getClient('1').get();
    const response = await NETWORK.sendHttpRequest('POST', '/api/client/project/request', {
      ...formData,
      clientId: clientCache.clientId,
    });
    console.log(clientCache.clientId);
    if (response.is_successful) {
      console.log('Project configuration submitted successfully.');
      alert('Project configuration submitted successfully.');
    } else {
      console.error('Failed to submit project configuration:', response.error);
      alert(`Failed to submit project configuration: ${response.error}`);
    }
  } catch (error) {
    console.error('Network error while submitting project configuration:', error);
    alert(`Network error while submitting project configuration: ${error}`);
  }
}
