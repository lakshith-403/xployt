import { CacheObject } from '../../cacheBase';
import { projectFinanceEndpoints } from '../network/project-finance.network';

export interface ReportPayment {
  reportId: number;
  hackerId: number;
  severity: string;
  vulnerabilityType: string;
  title: string;
  createdAt: string;
  status: string;
  payment_amount: number;
  paid: boolean;
}

export interface ProjectFinanceData {
  projectId: number;
  reports: ReportPayment[];
  totalExpenditure: number;
}

export class ProjectFinanceCache extends CacheObject<ProjectFinanceData> {
  private projectId: number;

  constructor(projectId: number) {
    super();
    this.projectId = projectId;
  }

  async load(): Promise<ProjectFinanceData> {
    const response = await projectFinanceEndpoints.getProjectReports(this.projectId);

    if (!response.is_successful) {
      throw new Error('Failed to load project finance data');
    }

    return response.data as ProjectFinanceData;
  }
}
