import { CACHE_STORE } from '@/data/cache';
import NETWORK from '../../network/network';
import { modalAlertOnlyCancel } from '@/main';
import { setContent } from '@/components/ModalManager/ModalManager';
import ModalManager from '@/components/ModalManager/ModalManager';
/**
 * Sends the project configuration form data to the backend.
 *
 * @param {any} formData - The form data to send.
 * @returns {Promise<void>} A promise that resolves when the request is complete.
 */
export async function requestProject(formData: any): Promise<void> {
  try {
    // const clientCache = await CACHE_STORE.getClient('1').get();
    const currentUser = await CACHE_STORE.getUser().get();
    if (currentUser.type !== 'Client') {
      setContent(modalAlertOnlyCancel, {
        '.modal-title': 'Error',
        '.modal-message': 'Only Users with Client role can request projects.',
      });
      ModalManager.show('alertOnlyCancel', modalAlertOnlyCancel);
      return;
    }
    // const clientCache = await CACHE_STORE.getClient(userCache.id).get();
    // console.log('client cache is', clientCache);
    const response = await NETWORK.sendHttpRequest('POST', '/api/client/project/request', {
      ...formData,
      clientId: currentUser.id,
    });
    console.log(currentUser.id);
    if (response.is_successful) {
      console.log('Project configuration submitted successfully.');
      // alert('Project configuration submitted successfully.');
      setContent(modalAlertOnlyCancel, {
        '.modal-title': 'Success',
        '.modal-message': 'Project configuration submitted successfully.',
      });
      if (currentUser.type === 'Client') {
        CACHE_STORE.getClientProjects(currentUser.id).invalidate_cache();
      }

      ModalManager.show('alertOnlyCancel', modalAlertOnlyCancel);
    } else {
      console.error('Failed to submit project configuration:', response.error);
      setContent(modalAlertOnlyCancel, {
        '.modal-title': 'Error',
        '.modal-message': `Failed to submit project configuration: ${response.error}`,
      });
      ModalManager.show('alertOnlyCancel', modalAlertOnlyCancel);
    }
  } catch (error) {
    console.error('Network error while submitting project configuration:', error);
    // alert(`Network error while submitting project configuration: ${error}`);
    setContent(modalAlertOnlyCancel, {
      '.modal-title': 'Error',
      '.modal-message': `Network error while submitting project configuration: ${error}`,
    });
    ModalManager.show('alertOnlyCancel', modalAlertOnlyCancel);
  }
}
