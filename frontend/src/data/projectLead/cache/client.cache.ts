import { ProjectInfo } from '@/data/validator/cache/projectInfo';
import { CacheObject, DataFailure } from '../../cacheBase';
// import { projectInfoEndpoints } from './../network/projectInfo.network';

export class Client {
  clientId: number;
  clientName: string;
  email: string;
  username: string;

  constructor(data: any) {
    this.clientId = data['clientId'];
    this.clientName = data['clientName'];
    this.email = data['email'];
    this.username = data['username'];
  }
}

// export class ProjectInfoCache extends CacheObject<ProjectInfo> {
//   async load(arg: string[]): Promise<ProjectInfo> {
//     const response = await projectInfoEndpoints.getProjectInfo(arg[0]);

//     if (!response.is_successful) throw new DataFailure('load project', response.error ?? '');

//     return new ProjectInfo(response.data);
//   }
// }

export class ClientCacheMock extends CacheObject<Client> {
  async load(arg: string[]): Promise<Client> {
    // console.log('Mocking project data');
    // console.log('projetID', arg);
    if (arg[0] === '1') {
      return new Client({
        clientId: 1,
        clientName: 'Client 1',
        email: 'client1@example.com',
        username: 'client1',
      });
    }
    return new Client({
      clientId: 2,
      clientName: 'Client 2',
      email: 'client2@example.com',
      username: 'client2',
    });
  }
}
