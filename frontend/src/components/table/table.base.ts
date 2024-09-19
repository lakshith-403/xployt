import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './table.base.scss';

export class tableBase {
  content: Record<string, any>[];
  headers?: string[];
  className?: string;

  constructor(content: Record<string, any>[], headers: string[], className: string = '') {
    this.content = content;
    this.headers = headers;
    this.className = className;
  }

  public render(q: Quark): void {
    $(q, 'div', `table ${this.className}`, {}, (q) => {
      if (this.headers && this.headers.length > 0) {
        $(q, 'div', 'table-header', {}, (q) => {
          this.headers!.forEach((header) => {
            $(q, 'span', 'table-header-cell', {}, header);
          });
        });
      }
      this.content.forEach((item) => {
        $(q, 'div', 'table-row', {}, (q) => {
          Object.values(item).forEach((element) => {
            $(q, 'span', 'table-cell', {}, (q) => {
              if (typeof element === 'string' && element.startsWith('<button')) {
                q.innerHTML = element; // Use innerHTML to render the button
              } else {
                q.textContent = element!.toString();
              }
            });
          });
        });
      });
    });
  }
}