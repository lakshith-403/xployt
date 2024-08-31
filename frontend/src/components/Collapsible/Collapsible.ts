import { QuarkFunction as $, Quark } from '../../ui_lib/quark';

export default class CollapsibleComponent {
  private container: HTMLElement;
  private content: HTMLElement;
  private button: HTMLElement;
  private header: HTMLElement;

  constructor(q: Quark, title: string, content: any[]) {
    this.container = $(q, 'div', 'collapsible-container', {}, (q) => {});
    this.header = $(this.container, 'div', 'collapsible-header', {}, (q) => {
      $(q, 'span', 'collapsible-title', {}, title);
    });
    this.button = $(this.header, 'button', 'collapsible-button', { onclick: () => this.toggle() }, '▼');
    this.content = $(this.container, 'div', 'collapsible-content', {}, (q) => {
      content.forEach((line) => {
        $(q, 'div', 'collapsible-line', {}, (q) => {
          Object.values(line).forEach((element) => {
            $(q, 'span', 'collapsible-element', {}, element!.toString());
          });
        });
      });
    });
    this.hideContent();
  }

  private toggle() {
    if (this.content.style.display === 'none') {
      this.showContent();
    } else {
      this.hideContent();
    }
  }

  private showContent() {
    this.content.style.display = 'flex';
    this.button.textContent = '▲';
  }

  private hideContent() {
    this.content.style.display = 'none';
    this.button.textContent = '▼';
  }
}
