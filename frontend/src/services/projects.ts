import { CACHE_STORE } from '@data/cache';
import NETWORK from '@data/network/network';

export const getProjects = async (userId: string, userType: string) => {
  console.log('Getting projects for user type:', userType);
  console.log('Getting User ID:', userId);
  switch (userType) {
    case 'ProjectLead':
      // /api/lead/projects/:userId
      console.log('Getting lead projects');
      const leadProjects = CACHE_STORE.getLeadProjects(userId);
      return await leadProjects.get(false, userId);

    case 'Client':
      // /api/client/projects/:userId
      console.log('Getting client projects');
      const clientProjects = await CACHE_STORE.getClientProjects(userId).get(false, userId);
      return clientProjects;

    case 'Validator':
      console.log('Getting validator projects');
      const validatorProjects = await NETWORK.get(`/api/validator/projects/${userId}`, { showLoading: true });
      return validatorProjects;

    default:
      return [];
  }
};
