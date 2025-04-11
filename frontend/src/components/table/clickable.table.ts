import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import { router } from '../../ui_lib/router';
import { tableBase } from '@components/table/table.base';

export interface ContentItem {
  id: number; // or string, depending on your requirements
  [key: string]: any; // Allow other fields
}

export class ClickableTable extends tableBase {
  private onClick: (id: number) => void;

  constructor(content: ContentItem[], headers: string[], className: string = '', onClick: (id: number) => void = () => {}) {
    super(content, headers, className);
    this.onClick = onClick;
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
        $(q, 'a', 'table-row-link', {}, (q) => {
          $(q, 'div', 'table-row', {}, (q) => {
            Object.values(item).forEach((element, index) => {
              index !== 0 && $(q, 'span', 'table-cell', {}, element!.toString());
            });
          });
        }).addEventListener('click', () => {
          this.onClick(item.id);
        });
      });
    });
  }
}
