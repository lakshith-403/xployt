import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './collap.base.scss';
export class CollapsibleBase {
  protected container?: HTMLElement;
  public content?: HTMLElement;
  private button?: HTMLElement;
  private title: string;
  private className: string;

  constructor(title: string, className: string = '') {
    this.className = className;
    this.title = title;
  }
  render(q: Quark) {
    this.container = $(q, 'div', `collapsible ${this.className}`, {}, (q) => {
      $(q, 'div', 'header', {}, (q) => {
        $(q, 'span', 'title', {}, this.title);
        this.button = $(
          q,
          'button',
          'toggle-button',
          {
            onclick: () => {
              this.toggle();
            },
          },
          '▼'
        );
      });
    });
    this.content = $(this.container!, 'div', 'content', {}, '');
    this.hideContent();
    return this.container;
  }

  private toggle() {
    if (this.content!.style.display === 'none') {
      this.showContent();
    } else {
      this.hideContent();
    }
  }

  private showContent() {
    this.content!.style.display = 'flex';
    this.button!.textContent = '▲';
  }

  private hideContent() {
    this.content!.style.display = 'none';
    this.button!.textContent = '▼';
  }
  public getContent() {
    return this.content!;
  }
}
