import { ProjectInfo } from '@/data/validator/cache/projectInfo';
import { CacheObject, DataFailure } from '../../cacheBase';
// import { projectInfoEndpoints } from './../network/projectInfo.network';

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
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'unconfigured';

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
    this.status = data['status'];
  }
}

// export class ProjectInfoCache extends CacheObject<ProjectInfo> {
//   async load(arg: string[]): Promise<ProjectInfo> {
//     const response = await projectInfoEndpoints.getProjectInfo(arg[0]);

//     if (!response.is_successful) throw new DataFailure('load project', response.error ?? '');

//     return new ProjectInfo(response.data);
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
        status: 'unconfigured',
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
      status: 'pending',
    });
  }
}
