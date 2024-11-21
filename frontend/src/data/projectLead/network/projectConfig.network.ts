import NETWORK, { Response } from '../../network/network';
/**
 * Sends a request to reject a project.
 *
 * @param {string} projectId - The ID of the project to reject.
 * @returns {Promise<void>} A promise that resolves when the request is complete.
 */
export async function getProjectRequest(projectId: string): Promise<Response> {
  return NETWORK.sendHttpRequest('GET', `/api/lead/project/${projectId}`);
}

export async function rejectProject(projectId: string): Promise<void> {
  try {
    const response = await NETWORK.sendHttpRequest('POST', `/projects/${projectId}/reject`, {});

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
    const response = await NETWORK.sendHttpRequest('POST', `/projects/${projectId}/accept`, {});

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
export async function submitProjectConfig(formData: any): Promise<void> {
  const response = await NETWORK.sendHttpRequest('POST', '/api/lead/project/config', {
    formData,
  });
}
