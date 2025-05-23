import { Quark} from '@ui_lib/quark';
import { User, UserCache } from '@data/user';
import { UserType } from '@data/user';
import { CACHE_STORE } from '@data/cache';

import Hacker from './tabOverviewContent/hacker';
import CommonOverview from './tabOverviewContent/commonOverview';

import './tabOverview.scss';

export default class Overview {
  private user!: User;
  private userCache: UserCache;
  private role!: UserType;

  constructor(private projectId: string, public readonly rerender: () => void) {
    this.userCache = CACHE_STORE.getUser();
  }

  private async loadData(): Promise<void> {
    try {
      this.user = await this.userCache.get();
      this.role = this.user.type;
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  }

  async render(q: Quark): Promise<void> {
    await this.loadData();

    switch (this.role) {
      case 'Hacker':
        const hacker = new Hacker(this.projectId);
        await hacker.render(q);
        break;
      case "Validator":
        const val = new Hacker(this.projectId);
        await val.render(q);
        break;
      default:
        const defaultOverview = new CommonOverview(this.projectId, this.role, () => this.rerender());
        await defaultOverview.render(q);
        break;
    }
  }
}
