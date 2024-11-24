import { ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import { HackerDashboard } from './hacker/dashboard/dashboard'
import { User, UserCache } from '@/data/user';
import {CACHE_STORE} from "@data/cache";

class UserDashboard extends View {
    private user!: User;
    private userCache: UserCache;
  constructor() {
    super();
      this.userCache = CACHE_STORE.getUser('1');
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
      console.log(this.user.role);
      // switch (this.user.role) {
      //     case 'project_lead':
      //         // const leadDashboard = new Lead(this.projectId);
      //         // leadDashboard.render(q);
      //         break;
      //
      //     case 'guest':
      //         // const clientDashboard = new Client();
      //         // clientDashboard.render(q);
      //         break;
      //     case 'hacker':
      //         const hackerDashboard = new HackerDashboard({userId: '1'});
      //         hackerDashboard.render(q);
      //         break;
      // }
      const hackerDashboard = new HackerDashboard({userId: '1'});
              hackerDashboard.render(q);

  }
}

export const userDashboardViewHandler = new ViewHandler('dashboard', UserDashboard);