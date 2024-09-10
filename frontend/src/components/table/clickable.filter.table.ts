import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import { FilterableTable } from './filterable.table';

interface ContentItem {
  id: number; // or string, depending on your requirements
  [key: string]: any; // Allow other fields
}

export class ClickableFilterableTable extends FilterableTable {
  constructor(content: ContentItem[], headers: string[], checkboxState: { [key: string]: boolean }, filteredField: string, className: string = '') {
    super(content, headers, checkboxState, filteredField, className);
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
      this.rows = $(q, 'div', 'table-rows', {}, (q) => {
        this.content.forEach((item) => {
          for (const key of this.falseKeys) {
            if (key === item[this.filteredField]) {
              return;
            }
          }
          const url = '/projects/' + item.id;
          $(q, 'a', 'table-row-link', { href: url }, (q) => {
            $(q, 'div', 'table-row', {}, (q) => {
              Object.values(item).forEach((element) => {
                $(q, 'span', 'table-cell', {}, element!.toString());
              });
            });
          });
        });
      });
    });
  }

  public updateRows(checkboxState: { [key: string]: boolean }): void {
    this.falseKeys = this.getFalseKeys(checkboxState);
    if (!this.rows) {
      return;
    }
    this.rows.innerHTML = '';
    this.content.forEach((item) => {
      for (const key of this.falseKeys) {
        if (key === item[this.filteredField]) {
          return;
        }
      }
      const url = item.url; // Assuming the URL is stored in the 'url' field
      $(this.rows!, 'a', 'table-row-link', { href: url }, (q) => {
        $(q, 'div', 'table-row', {}, (q) => {
          Object.values(item).forEach((element) => {
            $(q, 'span', 'table-cell', {}, element!.toString());
          });
        });
      });
    });
  }
}
