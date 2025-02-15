import { CacheObject, DataFailure } from '../../cacheBase';
// import { getProjectRequest } from '../network/projectConfig.network';
// import { projectInfoEndpoints } from './../network/projectInfo.network';
import { Response } from '../../network/network';
export class ProjectOverviewLead {
  projectId: string;
  clientId: number;
  accessLink: string;
  title: string;
  clientName: string;
  description: string;
  startDateDay: string;
  startDateMonth: string;
  startDateYear: string;
  endDateDay: string;
  endDateMonth: string;
  endDateYear: string;
  technicalStack: string[];
  state: 'Pending' | 'Active' | 'Completed' | 'Cancelled' | 'Unconfigured' | 'Closed';

  constructor(data: any) {
    this.projectId = data['projectId'];
    this.clientId = data['clientId'];
    this.accessLink = data['accessLink'];
    this.title = data['title'];
    this.clientName = data['clientName'];
    this.description = data['description'];
    this.startDateDay = data['startDateDay'];
    this.startDateMonth = data['startDateMonth'];
    this.startDateYear = data['startDateYear'];
    this.endDateDay = data['endDateDay'];
    this.endDateMonth = data['endDateMonth'];
    this.endDateYear = data['endDateYear'];
    this.technicalStack = data['technicalStack'];
    this.state = data['state'];
  }
}

interface ProjectData {
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

// export class ProjectOverviewLeadCache extends CacheObject<ProjectOverviewLead> {
//   async load(projectId: string): Promise<ProjectOverviewLead> {
// const response = await getProjectRequest(projectId);

// if (!response.is_successful) throw new DataFailure('load project', response.error ?? '');

// const data = response.data as ProjectData; // Cast response.data to the new interface

//     return new ProjectOverviewLead({
//       ...data,
//       startDateDay: data.startDate?.split('-')[2],
//       startDateMonth: data.startDate?.split('-')[1],
//       startDateYear: data.startDate?.split('-')[0],
//       endDateDay: data.endDate?.split('-')[2],
//       endDateMonth: data.endDate?.split('-')[1],
//       endDateYear: data.endDate?.split('-')[0],
//     });
//   }
// }

export class ProjectOverviewLeadCacheMock extends CacheObject<ProjectOverviewLead> {
  async load(arg: string): Promise<ProjectOverviewLead> {
    // console.log('Mocking project data');
    // console.log('projetID', arg);
    console.log('arg', arg);
    if (arg == '1') {
      return new ProjectOverviewLead({
        projectId: '1',
        clientId: 1,
        accessLink: 'https://accesslink.com',
        title: 'Project GT-175',
        clientName: 'Client 1',
        startDateDay: '01',
        startDateMonth: '01',
        startDateYear: '2021',
        endDateDay: '31',
        endDateMonth: '12',
        endDateYear: '2021',
        description:
          'Acceslink.com is a website that allows you to access links to projects. It is a project that is used to test the acceslink.com website. Also, with the a dvanced search, you can find the project you are looking for.',
        technicalStack: ['React', 'Node', 'Express'],
        state: 'unconfigured',
      });
    }
    return new ProjectOverviewLead({
      projectId: '2',
      clientId: 2,
      accessLink: 'https://accesslink.com',
      title: 'Project WV-102',
      clientName: 'Client 2',
      startDateDay: '01',
      startDateMonth: '01',
      startDateYear: '2021',
      endDateDay: '31',
      endDateMonth: '12',
      endDateYear: '2021',
      description:
        'Acceslink.com is a website that allows you to access links to projects. It is a project that is used to test the acceslink.com website. Also, with the a dvanced search, you can find the project you are looking for.',
      technicalStack: ['React', 'Node', 'Express'],
      state: 'pending',
    });
  }
}
