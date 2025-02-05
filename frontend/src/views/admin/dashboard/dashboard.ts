import { ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import './dashboard.scss';

export class AdminDashboard extends View {
  constructor() {
    super();
  }

  async render(q: Quark): Promise<void> {
    q.innerHTML = '';
    $(q, 'div', 'admin-dashboard', {}, (q) => {
      $(q, 'h1', 'admin-dashboard-title', {}, 'Admin Dashboard');
    });
  }
}
