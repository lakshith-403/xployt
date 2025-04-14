import { ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import { HackerDashboard } from './hacker/dashboard/dashboard';
import { ClientDashboard } from '@views/client/dashboard/dashboard';
import { User, UserCache } from '@/data/user';
import { CACHE_STORE } from '@data/cache';
import { MainDashboard } from '@views/common/mainDashboard/mainDashboard';
// import { ProjectLeadDashboard } from '@views/projectLead/dashboard/dashboard';
// import { ValidatorDashboard } from '@views/validator/dashboard/dashboard';
// import ProjectsView from '@views/common/projects/Projects';

class UserDashboard extends View {
  private user!: User;
  private userCache: UserCache;
  constructor() {
    super();
    this.userCache = CACHE_STORE.getUser();
  }

  private async loadData(): Promise<void> {
    try {
      this.user = await this.userCache.get();
      // console.log(this.user);
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  }

  async render(q: Quark): Promise<void> {
    await this.loadData();
    switch (this.user.type) {
      case 'ProjectLead':
      case 'Validator':
        const mainDashboard = new MainDashboard({ userId: this.user.id });
        await mainDashboard.render(q);
        break;

      case 'Client':
        const clientDashboard = new ClientDashboard({ userId: this.user.id });
        await clientDashboard.render(q);
        break;
      case 'Hacker':
        const hackerDashboard = new HackerDashboard({ userId: this.user.id });
        await hackerDashboard.render(q);
        break;
    }
  }
}

export const userDashboardViewHandler = new ViewHandler('dashboard', UserDashboard);
