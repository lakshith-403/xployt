import { CACHE_STORE } from '@/data/cache';
import NETWORK from '../../network/network';
import { modalAlertForErrors, modalAlertOnlyCancel, modalAlertOnlyOK } from '@/main';
import { convertToDom, setContent } from '@/components/ModalManager/ModalManager';
import ModalManager from '@/components/ModalManager/ModalManager';
import { router } from '@/ui_lib/router';
import alertOnlyConfirm from '@alerts/alertOnlyConfirm.html';

/**
 * Sends the project configuration form data to the backend.
 *
 * @param {any} formData - The form data to send.
 * @returns {Promise<void>} A promise that resolves when the request is complete.
 */
export async function requestProject(formData: any): Promise<void> {
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
  try {
    const response = await NETWORK.sendHttpRequest('POST', '/api/client/project/request', {
      ...formData,
      clientId: currentUser.id,
    });
    if (response.code === 200) {
      console.log('Project configuration submitted successfully.');

      ModalManager.includeModal('projectRequestFormConfirm', {
        '.button-confirm': () => {
          ModalManager.remove('projectRequestFormConfirm');
          router.navigateTo('/projects');
        },
      });
      const modalAlertConfirm = convertToDom(alertOnlyConfirm);
      setContent(modalAlertConfirm, {
        '.modal-title': 'Success',
        '.modal-message': `Project configuration submitted successfully. Project id: ${response.data.projectId} and ProjectLead id: ${response.data.leadId}`,
      });
      ModalManager.show('projectRequestFormConfirm', modalAlertConfirm);
      if (currentUser.type === 'Client') {
        CACHE_STORE.getClientProjects(currentUser.id).invalidate_cache();
      }
    }
  } catch (response: any) {
    console.error('Failed to submit project configuration:', response.error);
    setContent(modalAlertForErrors, {
      '.modal-title': 'Error',
      '.modal-message': `Failed to submit project configuration: ${response.message}`,
      '.modal-data': response.body.error,
      '.modal-servletClass': response.servlet,
      '.modal-uri': response.uri,
    });
    ModalManager.show('alertForErrors', modalAlertForErrors);
  }
}
