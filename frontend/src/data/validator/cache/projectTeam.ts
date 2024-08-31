import { projectInfoEndpoints } from './../network/projectInfo.network';
import { CacheObject, DataFailure } from '../../cacheBase';

export class ProjectTeam {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  scope: string;
  client: {
    name: string;
    id: number;
    username: string;
    email: string;
    company: string;
  };
  hacker: {
    name: string;
    id: number;
    username: string;
    email: string;
    assogned_validator: string;
  };

  constructor(data: any) {
    this.id = data['id'];
    this.title = data['title'];
    this.client = data['client'];
    this.hacker = data['hacker'];
    this.startDate = data['startDate'];
    this.endDate = data['endDate'];
    this.description = data['description'];
    this.scope = data['scope'];
  }
}

// export class ProjectTeamCache extends CacheObject<ProjectTeam> {
//   async load(arg: string[]): Promise<ProjectTeam> {
//     // const response = await NETWORK.getAllProjects(arg[0]);
//     // if (!response.is_successful)
//     //   throw new DataFailure('load project', response.error ?? '');
//     // return new ProjectTeam(response.data);
//   }
// }

export class ProjectTeamCacheMock extends CacheObject<ProjectTeam> {
  async load(arg: string[]): Promise<ProjectTeam> {
    // console.log('Mocking project data');
    // console.log('projetID', arg);
    if (arg[0] === '1') {
      return new ProjectTeam({
        id: 1,
        title: 'Project GT-175',
        client: 'Client 1',
        startDate: '2021-01-01',
        endDate: '2021-12-31',
        description: 'Description of project 1',
        scope: 'Scope of project 1',
      });
    }
    return new ProjectTeam({
      id: 2,
      title: 'Project WV-102',
      client: 'Client 2',
      startDate: '2021-01-01',
      endDate: '2021-12-31',
      description: 'Description of project 1',
      scope: 'Scope of project 1',
    });
  }
}
