import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { User, UserCache } from '@data/user';
import { UserType } from '@data/user';
import { CACHE_STORE } from '@data/cache';

export default class Payments {
  private user!: User;
  private userCache: UserCache;
  private role!: UserType;

  constructor(private projectId: string) {
    this.userCache = CACHE_STORE.getUser();
  }

  private async loadData(): Promise<void> {
    try {
      this.user = await this.userCache.get();
      // console.log(this.user);
      this.role = this.user.type;
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  }

  async render(q: Quark): Promise<void> {
    $(q, 'div', ' py-2 d-flex flex-column align-items-center', {}, (q) => {
      $(q, 'h1', 'text-center heading-1', {}, 'Payments');

      const paymentsTableContainer = $(q, 'div', 'container', {}, (q) => {
        $(q, 'div', 'text-center sub-heading-3 bg-secondary container p-2 text-default', {}, 'Loading payments...');
      });
    });

    // await this.loadData();
    // switch (this.role) {
    //   case 'ProjectLead':
    //     const lead = new Lead(this.projectId);
    //     lead.render(q);
    //     break;
    //   case 'Client':
    //     const client = new Client(this.projectId);
    //     client.render(q);
    //     break;
    //   case 'Hacker':
    //     const hacker = new Hacker(this.projectId);
    //     hacker.render(q);
    //     break;
    // }
  }
}
