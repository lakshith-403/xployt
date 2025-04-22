import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { User, UserCache } from '@data/user';
import { UserType } from '@data/user';
import { CACHE_STORE } from '@data/cache';

import Hacker from './tabOverviewContent/hacker';
import CommonOverview from './tabOverviewContent/commonOverview';

import './tabOverview.scss';
import { ButtonType } from '@/components/button/base';
import { FormButton } from '@/components/button/form.button';
import { router } from '@/ui_lib/router';

export default class Overview {
  private user!: User;
  private userCache: UserCache;
  private role!: UserType;

  constructor(private projectId: string) {
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
      default:
        const defaultOverview = new CommonOverview(this.projectId, this.role);
        await defaultOverview.render(q);
        break;
    }
  }
}
