import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './SideBar.scss';
// import { Router } from '../../ui_lib/router';
import { NavigationView } from '../../ui_lib/view';
export interface SidebarTab {
  id: string;
  title: string;
  url: string;
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
    this.activeTab = tabs[0]?.id || '';
  }

  private toggleSidebar = (): void => {
    this.isOpen = !this.isOpen;
    this.updateSidebarVisibility();
  };

  private updateSidebarVisibility(): void {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    if (sidebar) {
      sidebar.style.transform = this.isOpen
        ? 'translateX(0)'
        : 'translateX(-100%)';
      // mainContent.style.marginLeft = this.isOpen ? '250px' : '0';
    }
  }

  private setActiveTab(tabId: string): void {
    this.buttons.forEach((btn) => btn.classList.remove('active'));
    this.buttons.find((btn) => btn.id === tabId)?.classList.add('active');
    this.activeTab = tabId;
    window.location.href = this.tabs.find((tab) => tab.id === tabId)!.url;
  }

  render(q: Quark): void {
    // Sidebar
    $(q, 'div', 'side-bar', {}, (q) => {
      $(q, 'button', 'toggle-btn', { onclick: this.toggleSidebar }, (q) => {
        q.innerHTML = '☰';
      });
      $(q, 'nav', 'sidebar-nav', {}, (q) => {
        this.tabs.forEach((tab) => {
          $(
            q,
            'button',
            `nav-btn ${this.activeTab === tab.id ? 'active' : ''}`,
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

// export const sidebarViewHandler = (
//   baseUrl: string,
//   sidebarTabs: SidebarTab[]
// ) => ({
//   render: (q: Quark) => {
//     const sidebarView = new SidebarView(baseUrl, sidebarTabs);
//     sidebarView.render(q);
//   },
// });
