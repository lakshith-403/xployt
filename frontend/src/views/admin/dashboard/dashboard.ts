import { ViewHandler } from '@/ui_lib/view';
import { MainDashboard } from '@/views/common/mainDashboard/mainDashboard';

export class AdminDashboard extends MainDashboard {
  constructor(params: { userId: string }) {
    super(params);
  }
}

export const adminDashboardViewHandler = new ViewHandler('', AdminDashboard);
