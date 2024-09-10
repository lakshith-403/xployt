import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import { View, ViewHandler } from '../../ui_lib/view';
import './Tabs.scss';

interface Tab {
  title: string;
  render: (q: Quark) => void;
}

class TabsComponent {
  tabs: Tab[];
  activeTabIndex: number;
  contentElement!: HTMLElement;

  constructor(tabs: Tab[]) {
    this.tabs = tabs;
    this.activeTabIndex = 0;
  }

  render(q: Quark): void {
    $(q, 'div', 'tabs-container', {}, (q) => {
      // Render tab headers
      $(q, 'div', 'tabs-header', {}, (q) => {
        this.tabs.forEach((tab, index) => {
          $(q, 'button', 'tab-button', { onclick: () => this.switchTab(index) }, (q) => {
            q.innerHTML = tab.title;
          });
        });
      });

      // Render content area
      $(q, 'div', 'tabs-content', {}, (q) => {
        this.contentElement = q;
        this.renderActiveTabContent();
      });
    });
  }

  switchTab(index: number): void {
    this.activeTabIndex = index;
    this.renderActiveTabContent();
  }

  renderActiveTabContent(): void {
    this.contentElement.innerHTML = '';
    this.tabs[this.activeTabIndex].render(this.contentElement);
  }
}

export default TabsComponent;
