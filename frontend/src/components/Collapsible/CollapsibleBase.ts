import { QuarkFunction as $, Quark } from '../../ui_lib/quark';

export abstract class CollapsibleBase<T> {
  protected container: HTMLElement;
  protected content: HTMLElement;
  protected button: HTMLElement;
  protected header: HTMLElement;
  protected tableHeader: HTMLElement | null;

  constructor(
    protected q: Quark,
    protected title: string,
    protected contentData: T[],
    protected tableHeaders?: string[],
    protected className?: string
  ) {
    this.container = $(this.q, 'div', `collapsible-container ${className}`, {}, (q) => {});
    this.header = this.createHeader();
    this.button = this.createButton();
    this.tableHeader = this.createTableHeader();
    this.content = this.createContent();
    this.hideContent();
  }

  private createHeader(): HTMLElement {
    return $(this.container, 'div', 'collapsible-header', {}, (q) => {
      $(q, 'span', 'collapsible-title', {}, this.title);
    });
  }

  private createButton(): HTMLElement {
    return $(this.header, 'button', 'collapsible-button', { onclick: () => this.toggle() }, '▼');
  }

  private createTableHeader(): HTMLElement | null {
    if (this.tableHeaders && this.tableHeaders.length > 0) {
      return $(this.container, 'div', 'collapsible-table-header', {}, (q) => {
        this.tableHeaders!.forEach((header) => {
          $(q, 'span', 'collapsible-table-header-cell', {}, header);
        });
      });
    }
    return null;
  }

  private createContent(): HTMLElement {
    return $(this.container, 'div', 'collapsible-content', {}, (q) => {
      this.contentData.forEach((item) => this.renderContentItem(q, item));
    });
  }

  protected abstract renderContentItem(q: Quark, item: T): void;

  private toggle() {
    if (this.content.style.display === 'none') {
      this.showContent();
    } else {
      this.hideContent();
    }
  }

  protected showContent() {
    if (this.tableHeader) {
      this.tableHeader.style.display = 'flex';
    }
    this.content.style.display = 'flex';
    this.button.textContent = '▲';
  }

  protected hideContent() {
    if (this.tableHeader) {
      this.tableHeader.style.display = 'none';
    }
    this.content.style.display = 'none';
    this.button.textContent = '▼';
  }

  public getContainer(): HTMLElement {
    return this.container;
  }
}
