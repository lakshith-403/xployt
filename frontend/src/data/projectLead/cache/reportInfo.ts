import { CacheObject, DataFailure } from '../../cacheBase';
import { reportInfoEndpoints } from '../network/reportInfo.network';

export class ReportInfo {
  id: number;
  title: string;
  client: string;
  startDate: string;
  endDate: string;
  description: string;
  scope: string;

  constructor(data: any) {
    this.id = data['id'];
    this.title = data['title'];
    this.client = data['client'];
    this.startDate = data['startDate'];
    this.endDate = data['endDate'];
    this.description = data['description'];
    this.scope = data['scope'];
  }
}

export class ReportInfoCache extends CacheObject<ReportInfo> {
  async load(arg: string[]): Promise<ReportInfo> {
    const response = await reportInfoEndpoints.getReportInfo(arg[0]);

    if (!response.is_successful)
      throw new DataFailure('load report', response.error ?? '');

    return new ReportInfo(response.data);
  }
}

export class ReportInfoCacheMock extends CacheObject<ReportInfo> {
  async load(arg: string[]): Promise<ReportInfo> {
    // console.log('Mocking preport data');
    // console.log('reportID', arg);
    if (arg[0] === '1') {
      return new ReportInfo({
        id: 1,
        title: 'Report GT-175',
        client: 'Client 1',
        startDate: '2021-01-01',
        endDate: '2021-12-31',
        description: 'Description of report 1',
        scope: 'Scope of report 1',
      });
    }
    return new ReportInfo({
      id: 2,
      title: 'Report WV-102',
      client: 'Client 2',
      startDate: '2021-01-01',
      endDate: '2021-12-31',
      description: 'Description of report 1',
      scope: 'Scope of report 1',
    });
  }
}
