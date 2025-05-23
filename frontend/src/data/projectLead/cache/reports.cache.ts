import { CacheObject, DataFailure } from '../../cacheBase';
import { reportEndpoints } from '../network/report.network';

interface ReportResponse {
  data: [ReportDetails[], ReportDetails[]];
  is_successful: boolean;
  error?: string;
  trace?: string;
}

interface ReportDetails {
  id: number;
  status: 'pending' | 'closed' | 'in progress';
  title: string;
  client: string;
  pending_reports: string;
}

export class Report {
  id: number;
  status: 'pending' | 'closed' | 'in progress';
  title: string;
  client: string;
  pendingReports: string;
  color: string; // Add color based on pending_reports
  // severity: "critical" | "minor" | "informational"

  constructor(data: any) {
    this.id = data['id'];
    this.status = data['status'];
    this.title = data['title'];
    this.client = data['client'];
    this.pendingReports = data['pending_reports'];
    this.color = data['color'];
  }
}

export class ReportsCache extends CacheObject<Report[][]> {
  async load(userId: string): Promise<Report[][]> {
    const response = (await reportEndpoints.getAllReports(userId)) as ReportResponse;

    if (!response.is_successful) throw new DataFailure('load report', response.error ?? '');

    return [
      response['data'].slice(0, 1).map((reportDetails: ReportDetails[]) => {
        return new Report({ ...reportDetails });
      }),
      response['data'].slice(1, 2).map((ReportDetails: ReportDetails[]) => {
        return new Report({ ...ReportDetails });
      }),
    ];
  }
}

export class ReportsCacheMock extends CacheObject<Report[][]> {
  async load(userId: string): Promise<Report[][]> {
    return [
      [
        new Report({
          id: 1,
          status: 'pending',
          title: 'Report 1',
          client: 'Client 1',
          pending_reports: 'Accepted',
          color: this.getColor('Accepted'), // Add color based on pending_reports
        }),
        new Report({
          id: 2,
          status: 'closed',
          title: 'Report 2',
          client: 'Client 2',
          pending_reports: 'Rejected',
          color: this.getColor('Rejected'), // Add color based on pending_reports
        }),
      ],
      [
        new Report({
          id: 3,
          status: 'in progress',
          title: 'Report 3',
          client: 'Client 3',
          pending_reports: 'More Info',
          color: this.getColor('More Info'), // Add color based on pending_reports
        }),
      ],
    ];
  }

  private getColor(pendingReports: string): string {
    switch (pendingReports) {
      case 'Accepted':
        return '#1B8D64';
      case 'Rejected':
        return '#E75151';
      case 'More Info':
        return '#E57F46';
      default:
        return 'gray'; // Optional: Add a default color
    }
  }
}
