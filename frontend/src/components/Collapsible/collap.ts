import { QuarkFunction as $, Quark } from '../../ui_lib/quark';

export class CollapsibleBase {
  protected container?: HTMLElement;
  protected content?: HTMLElement;
  protected button?: HTMLElement;

  constructor(protected q: Quark, protected title: string, protected child: HTMLElement, protected className?: string) {
    this.className = className;
  }
  render(parent: Quark) {
    this.container = $(parent, 'div', `collapsible-container ${this.className}`, {}, (q) => {
      $(q, 'div', 'collapsible-header', {}, (q) => {
        $(q, 'span', 'collapsible-title', {}, this.title);
        this.button = $(q, 'button', 'collapsible-button', { onclick: () => this.toggle() }, '▼');
      });
      this.content = $(q, 'div', 'collapsible-content', {}, (q) => {
        q.appendChild(this.child);
      });
      this.hideContent();
    });
  }

  private toggle() {
    if (this.content!.style.display === 'none') {
      this.showContent();
    } else {
      this.hideContent();
    }
  }

  protected showContent() {
    this.content!.style.display = 'flex';
    this.button!.textContent = '▲';
  }

  protected hideContent() {
    this.content!.style.display = 'none';
    this.button!.textContent = '▼';
  }
}
