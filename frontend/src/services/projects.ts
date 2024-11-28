import { CACHE_STORE } from '@data/cache';

export const getProjects = async (userId: string, userType: string) => {
  console.log('Getting projects for user type:', userType);
  console.log('Getting User ID:', userId);
  switch (userType) {
    case 'ProjectLead':
      console.log('Getting lead projects');
      const leadProjects = CACHE_STORE.getLeadProjects(userId);
      return await leadProjects.get(false, userId);

    case 'Client':
      console.log('Getting client projects');
      const clientProjects = await CACHE_STORE.getClientProjects(userId).get(false, userId);
      return clientProjects;
    default:
      return [];
  }
};
