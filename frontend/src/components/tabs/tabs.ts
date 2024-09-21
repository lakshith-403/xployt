import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './tabs.scss';

interface Tab {
  title: string;
  render: (q: Quark) => void;
}

class TabsComponent {
  tabs: Tab[];
  activeTabIndex: number;
  contentElement!: HTMLElement;
  tabsButtons!: HTMLElement;

  constructor(tabs: Tab[]) {
    this.tabs = tabs;
    this.activeTabIndex = 0;
  }

  render(q: Quark): void {
    $(q, 'div', 'tabs-container', {}, (q) => {
      // Render tab headers
      this.tabsButtons = $(q, 'div', 'tabs-header', {}, (q) => {
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

    this.tabsButtons.children[this.activeTabIndex].classList.add('selected');
  }

  switchTab(index: number): void {
    this.tabsButtons.children[this.activeTabIndex].classList.remove('selected');
    this.tabsButtons.children[index].classList.add('selected');
    this.activeTabIndex = index;
    this.renderActiveTabContent();
  }

  renderActiveTabContent(): void {
    this.contentElement.innerHTML = '';
    this.tabs[this.activeTabIndex].render(this.contentElement);
  }
}

export default TabsComponent;
