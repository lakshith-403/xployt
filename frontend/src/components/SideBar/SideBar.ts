import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './SideBar.scss';
// import { Router } from '../../ui_lib/router';
import { NavigationView } from '../../ui_lib/view';
import { router } from '../../ui_lib/router';
import { UserCache } from '@/data/user';
import { CACHE_STORE } from '@/data/cache';
export interface SidebarTab {
  id: string;
  title: string;
  url: string;
  roles?: string[];
}

export class SidebarView implements NavigationView {
  baseURL: string;
  private isOpen: boolean = true;
  private activeTab: string;
  private tabs: SidebarTab[];
  private buttons: HTMLElement[] = [];

  constructor(baseurl: string, tabs: SidebarTab[]) {
    this.baseURL = baseurl;
    this.tabs = tabs;
    this.activeTab = tabs[0]?.id;
  }

  private toggleSidebar = (): void => {
    this.isOpen = !this.isOpen;
    this.updateSidebarVisibility();
  };

  private updateSidebarVisibility(): void {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    if (sidebar) {
      sidebar.style.transform = this.isOpen ? 'translateX(0)' : 'translateX(-100%)';
      // mainContent.style.marginLeft = this.isOpen ? '250px' : '0';
    }
  }

  private setActiveTab(tabId: string): void {
    this.buttons.forEach((btn) => btn.classList.remove('active'));
    this.buttons.find((btn) => btn.id === tabId)?.classList.add('active');
    this.activeTab = tabId;
    router.navigateTo(this.baseURL + this.tabs.find((tab) => tab.id === tabId)!.url);
  }

  render(q: Quark, currentRoute: string): void {
    // console.log('currentRoute', currentRoute);
    // Sidebar
    $(q, 'div', 'side-bar', {}, async (q) => {
      // $(q, 'button', 'toggle-btn', { onclick: this.toggleSidebar }, (q) => {
      //   q.innerHTML = '☰';
      // });
      const userType = (await CACHE_STORE.getUser().get()).type;
      $(q, 'nav', 'sidebar-nav', {}, (q) => {
        this.tabs.forEach((tab) => {
          if (tab.roles != null) {
            if (!tab.roles.includes(userType)) {
              return;
            }
          }
          $(
            q,
            'button',
            `nav-btn ${currentRoute === tab.id ? 'active' : ''}`,
            {
              onclick: () => this.setActiveTab(tab.id),
              id: tab.id,
            },
            (q) => {
              q.innerHTML = tab.title;
              this.buttons.push(q);
            }
          );
        });
      });
    });

    // Initial sidebar visibility
    this.updateSidebarVisibility();
  }
}
