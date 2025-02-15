import { getProjectConfigInfo } from '@/data/projectLead/network/projectConfig.network';
import { CacheObject, DataFailure } from '../../cacheBase';
// import { projectInfoEndpoints } from './../network/projectInfo.network';

export class ProjectConfigInfo {
  accessLink: string;
  title: string;
  description: string;
  startDateDay: string;
  startDateMonth: string;
  startDateYear: string;
  endDateDay: string;
  endDateMonth: string;
  endDateYear: string;
  technicalStack: string[];
  state: 'Pending' | 'Active' | 'Completed' | 'Rejected' | 'Unconfigured' | 'Closed';

  clientId: number;
  clientName: string;
  clientEmail: string;
  clientUsername: string;

  constructor(data: any) {
    this.accessLink = data['url'];
    this.title = data['title'];
    this.description = data['description'];
    this.technicalStack = data['technicalStack'];
    this.state = data['state'];
    this.startDateDay = data['startDateDay'];
    this.startDateMonth = data['startDateMonth'];
    this.startDateYear = data['startDateYear'];
    this.endDateDay = data['endDateDay'];
    this.endDateMonth = data['endDateMonth'];
    this.endDateYear = data['endDateYear'];

    this.clientId = data['clientId'];
    this.clientEmail = data['clientEmail'];
    this.clientUsername = data['clientUsername'];
    this.clientName = data['clientName'];
  }
  public updatestate(newstate: 'Pending' | 'Active' | 'Completed' | 'Rejected' | 'Unconfigured' | 'Closed'): void {
    this.state = newstate;
  }
}
interface ProjectData {
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}
export class ProjectConfigInfoCache extends CacheObject<ProjectConfigInfo> {
  async load(arg: string[]): Promise<ProjectConfigInfo> {
    const response = (await getProjectConfigInfo(arg[0])) as ProjectData; // Depracated

    if (!response.is_successful) throw new DataFailure('load project', response.error ?? '');

    return new ProjectConfigInfo({
      ...response.data,
      startDateDay: response.data?.startDate?.split('-')[2],
      startDateMonth: response.data?.startDate?.split('-')[1],
      startDateYear: response.data?.startDate?.split('-')[0],
      endDateDay: response.data?.endDate?.split('-')[2],
      endDateMonth: response.data?.endDate?.split('-')[1],
      endDateYear: response.data?.endDate?.split('-')[0],
    });
  }

  async set(projectConfig: ProjectConfigInfo): Promise<void> {
    this.data = projectConfig; // Store the new data in cache
    this.lastUpdated = Date.now(); // Mark as cached
  }
}

export class ProjectConfigInfoCacheMock extends CacheObject<ProjectConfigInfo> {
  async load(arg: string[]): Promise<ProjectConfigInfo> {
    // console.log('Mocking project data');
    // console.log('projetID', arg);
    if (arg[0] === '1') {
      return new ProjectConfigInfo({
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
        state: 'Pending',
        clientEmail: 'client1@example.com',
        clientUsername: 'client1',
      });
    }
    return new ProjectConfigInfo({
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
      state: 'Pending',
      clientEmail: 'client2@example.com',
      clientUsername: 'client2',
    });
  }
}
