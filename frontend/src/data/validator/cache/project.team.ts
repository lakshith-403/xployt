import { projectInfoEndpoints } from '../network/projectInfo.network';
import { CacheObject, DataFailure } from '../../cacheBase';

export interface ProjectTeam {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  scope: string;
  projectLead: {
    name: string;
    id: number;
    contact: string;
  };

  client: {
    name: string;
    id: number;
    username: string;
    email: string;
    company: string;
  };
  hackers: {
    name: string;
    id: number;
    username: string;
    email: string;
    assigned_validator: string;
  }[];
  validator: {
    name: string;
    id: number;
    username: string;
    email: string;
    assigned_hackers: [string];
  }[];
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
      return {
        id: 1,
        title: 'Project GT-175',
        client: { name: 'Clientl', id: 1, username: 'client1', email: 'example@gmail.com', company: 'company1' },
        hackers: [
          { name: 'Hacker1', id: 1, username: 'hacker1', email: 'hacker@gmail.com', assigned_validator: 'validator1' },
          { name: 'Hacker2', id: 2, username: 'hacker2', email: 'hacker@gmail.com', assigned_validator: 'validator1' },
        ],
        projectLead: { name: 'Lead1', id: 1, contact: 'contact1' },
        validator: [
          { name: 'Validator1', id: 1, username: 'validator1', email: 'maahelaQ@gmail.com', assigned_hackers: ['hacker1'] },
          { name: 'Validator1', id: 2, username: 'validator2', email: 'maahelaQ@gmail.com', assigned_hackers: ['hacker2'] },
        ],

        startDate: '2021-01-01',
        endDate: '2021-12-31',
        description: 'Description of project 1',
        scope: 'Scope of project 1',
      };
    }
    return {
      id: 1,
      title: 'Project GT-175',
      client: { name: 'Clientl', id: 1, username: 'client1', email: 'example@gmail.com', company: 'company1' },
      hackers: [{ name: 'Hacker1', id: 1, username: 'hacker1', email: 'hacker@gmail.com', assigned_validator: 'validator1' }],
      projectLead: { name: 'Lead1', id: 1, contact: 'contact1' },
      validator: [{ name: 'Validator1', id: 1, username: 'validator1', email: 'maahelaQ@gmail.com', assigned_hackers: ['hacker1'] }],
      startDate: '2021-01-01',
      endDate: '2021-12-31',
      description: 'Description of project 1',
      scope: 'Scope of project 1',
    };
  }
}
