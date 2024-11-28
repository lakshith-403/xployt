import NETWORK, { Response } from '../../network/network';
/**
 * Sends a request to reject a project.
 *
 * @param {string} projectId - The ID of the project to reject.
 * @returns {Promise<void>} A promise that resolves when the request is complete.
 */
export async function getProjectConfigInfo(projectId: string): Promise<Response> {
  return NETWORK.sendHttpRequest('GET', `/api/lead/project/${projectId}`);
}

export async function rejectProject(projectId: string): Promise<void> {
  try {
    const response = await NETWORK.sendHttpRequest('POST', `api/lead/project/reject/${projectId}`, {});

    if (response.is_successful) {
      console.log(`Project ${projectId} rejected successfully.`);
      alert(`Project ${projectId} rejected successfully.`);
    } else {
      console.error(`Failed to reject project ${projectId}:`, response.error);
      alert(`Failed to reject project ${projectId}: ${response.error}`);
    }
  } catch (error) {
    console.error('Network error while rejecting project:', error);
    alert(`Network error while rejecting project: ${error}`);
  }
}

/**
 * Sends a request to accept a project.
 *
 * @param {string} projectId - The ID of the project to accept.
 * @returns {Promise<void>} A promise that resolves when the request is complete.
 */
export async function acceptProject(projectId: string): Promise<void> {
  try {
    const response = await NETWORK.sendHttpRequest('POST', `api/lead/project/accept/${projectId}`, {});

    if (response.is_successful) {
      console.log(`Project ${projectId} accepted successfully.`);
      alert(`Project ${projectId} accepted successfully.`);
    } else {
      console.error(`Failed to accept project ${projectId}:`, response.error);
      alert(`Failed to accept project ${projectId}: ${response.error}`);
    }
  } catch (error) {
    console.error('Network error while accepting project:', error);
    alert(`Network error while accepting project: ${error}`);
  }
}
export async function submitProjectConfig(projectId: string, formData: any): Promise<void> {
  // Convert files to Base64 strings
  const attachmentsAsBase64 = await fileToBase64(formData.attachment);

  const response = await NETWORK.sendHttpRequest('POST', `/api/lead/project/config`, {
    ...formData,
    projectId: projectId,
    attachments: attachmentsAsBase64,
    low: Object.values(formData.low).join(','),
    medium: Object.values(formData.medium).join(','),
    high: Object.values(formData.high).join(','),
    critical: Object.values(formData.critical).join(','),
    informative: Object.values(formData.informative).join(','),
  });
}

function fileToBase64(file: File): Promise<string> {
  if (!file) {
    return Promise.resolve('');
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
