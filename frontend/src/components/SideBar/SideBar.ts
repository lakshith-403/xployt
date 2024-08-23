import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './SideBar.scss';

export interface SidebarTab {
  id: string;
  title: string;
  content: (q: Quark) => void;
}

class SidebarView {
  private isOpen: boolean = true;
  private activeTab: string;
  private tabs: SidebarTab[];
  private buttons: HTMLElement[] = [];

  constructor(tabs: SidebarTab[]) {
    this.tabs = tabs;
    this.activeTab = tabs[0]?.id || '';
  }

  private toggleSidebar = (): void => {
    this.isOpen = !this.isOpen;
    this.updateSidebarVisibility();
  };

  private updateSidebarVisibility(): void {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    const mainContent = document.querySelector('.main-content') as HTMLElement;
    if (sidebar && mainContent) {
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
    this.renderContent();
  }

  private renderContent(): void {
    const contentContainer = document.querySelector(
      '.content-container'
    ) as HTMLElement;
    if (contentContainer) {
      contentContainer.innerHTML = '';
      const activeTabContent = this.tabs.find(
        (tab) => tab.id === this.activeTab
      )?.content;
      if (activeTabContent) {
        $(contentContainer, 'div', 'active-content', {}, activeTabContent);
      }
    }
  }

  render(q: Quark): void {
    $(q, 'div', 'layout', {}, (q) => {
      // Sidebar
      $(q, 'div', 'sidebar', {}, (q) => {
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

      // Main content
      $(q, 'div', 'main-content', {}, (q) => {
        $(q, 'div', 'content-container', {}, (q) => {
          // Initial content render
          this.renderContent();
        });
      });
    });

    // Initial sidebar visibility
    this.updateSidebarVisibility();
  }
}

export const sidebarViewHandler = (sidebarTabs: SidebarTab[]) => ({
  render: (q: Quark) => {
    const sidebarView = new SidebarView(sidebarTabs);
    sidebarView.render(q);
  },
});
