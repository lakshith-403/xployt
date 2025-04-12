import { CACHE_STORE } from '@/data/cache';
import { User, UserCache } from '@data/user';
import { UserType } from '@data/user';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import { router } from '@/ui_lib/router';
import NETWORK from '@/data/network/network';

export default class ReportsTab {
  private projectState: string;
  constructor(private readonly projectId: string) {
    this.projectState = '';
  }

  async loadData(): Promise<void> {
    const currentUser = await CACHE_STORE.getUser().get();
    const userRole = currentUser.type;

    const projectData = await NETWORK.get(`/api/single-project/${this.projectId}?role=${userRole}`).then((response) => {
      return response.data.project;
    });
    this.projectState = projectData.state;
    console.log('projectData: ', projectData);
  }

  async render(q: Quark): Promise<void> {
    await this.loadData();

    if (this.projectState !== 'Active') {
      $(q, 'div', 'bg-secondary text-light-green px-2 py-1 rounded w-100 d-flex align-items-center justify-content-center', {}, (q) => {
        $(q, 'span', '', {}, 'Nothing to show here yet');
      });
    } else {
      $(q, 'div', 'bg-secondary text-light-green px-2 py-1 rounded w-100 d-flex align-items-center justify-content-center', {}, (q) => {
        $(q, 'span', '', {}, 'Reports');
      });
    }
  }
}
