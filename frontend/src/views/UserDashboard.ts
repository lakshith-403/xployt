import { ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import { HackerDashboard } from './hacker/dashboard/dashboard';
import { ClientDashboard } from '@views/client/dashboard/dashboard';
import { User, UserCache } from '@/data/user';
import { CACHE_STORE } from '@data/cache';
import ProjectsView from '@views/common/projects/Projects';
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
      console.log(this.user);
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  }

  async render(q: Quark): Promise<void> {
    await this.loadData();
    console.log(this.user.type);
    switch (this.user.type) {
      case 'ProjectLead':
        // const leadDashboard = new Lead(this.projectId);
        // leadDashboard.render(q);
        const projectsView = new ProjectsView({ projectId: this.user.id });
        await projectsView.render(q);
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
    // const hackerDashboard = new HackerDashboard({userId: this.user.id});
    // await hackerDashboard.render(q);
  }
}

export const userDashboardViewHandler = new ViewHandler('dashboard', UserDashboard);
