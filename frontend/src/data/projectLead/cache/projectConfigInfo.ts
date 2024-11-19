// import { CacheObject, DataFailure } from '../../cacheBase';
// // import { projectInfoEndpoints } from './../network/projectInfo.network';

// export class ProjectConfigInfo {
//   projectId: string;
//   clientId: number;
//   accessLink: string;
//   title: string;
//   clientName: string;
//   description: string;
//   startDate: string;
//   endDate: string;
//   technicalStack: string[];
//   status: 'pending' | 'active' | 'completed' | 'cancelled';

//   constructor(data: any) {
//     this.projectId = data['projectId'];
//     this.clientId = data['clientId'];
//     this.accessLink = data['accessLink'];
//     this.title = data['title'];
//     this.clientName = data['clientName'];
//     this.description = data['description'];
//     this.startDate = data['startDate'];
//     this.endDate = data['endDate'];
//     this.technicalStack = data['technicalStack'];
//     this.status = data['status'];
//   }
// }

// // export class ProjectInfoCache extends CacheObject<ProjectInfo> {
// //   async load(arg: string[]): Promise<ProjectInfo> {
// //     const response = await projectInfoEndpoints.getProjectInfo(arg[0]);

// //     if (!response.is_successful) throw new DataFailure('load project', response.error ?? '');

// //     return new ProjectInfo(response.data);
// //   }
// // }

// export class ProjectConfigInfoCacheMock extends CacheObject<ProjectConfigInfo> {
//   async load(arg: string[]): Promise<ProjectConfigInfo> {
//     // console.log('Mocking project data');
//     // console.log('projetID', arg);
//     if (arg[0] === '1') {
//       return new ProjectConfigInfo({
//         projectId: '1',
//         clientId: 1,
//         accessLink: 'https://accesslink.com',
//         title: 'Project GT-175',
//         clientName: 'Client 1',
//         startDate: '2021-01-01',
//         endDate: '2021-12-31',
//         description:
//           'Acceslink.com is a website that allows you to access links to projects. It is a project that is used to test the acceslink.com website. Also, with the a dvanced search, you can find the project you are looking for.',
//         technicalStack: ['React', 'Node', 'Express'],
//         status: 'pending',
//       });
//     }
//     return new ProjectConfigInfo({
//       projectId: '2',
//       clientId: 2,
//       accessLink: 'https://accesslink.com',
//       title: 'Project WV-102',
//       clientName: 'Client 2',
//       startDate: '2021-01-01',
//       endDate: '2021-12-31',
//       description:
//         'Acceslink.com is a website that allows you to access links to projects. It is a project that is used to test the acceslink.com website. Also, with the a dvanced search, you can find the project you are looking for.',
//       technicalStack: ['React', 'Node', 'Express'],
//       status: 'pending',
//     });
//   }
// }
