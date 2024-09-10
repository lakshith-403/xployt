import { FilterableTable } from './filterable.table';
import { QuarkFunction as $, Quark } from '../../ui_lib/quark';

export class ColoredFilterableTable extends FilterableTable {
  constructor(content: Record<string, any>[], headers: string[], checkboxState: { [key: string]: boolean }, filteredField: string, className: string = '') {
    super(content, headers, checkboxState, filteredField);
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
          $(q, 'div', 'table-row', {}, (q) => {
            Object.entries(item).forEach(([key, element]) => {
              if (key === 'color') {
                return;
              }
              const cell = $(q, 'span', 'table-cell', {}, element!.toString());
              if (item.pendingReports && key === 'pendingReports') {
                cell.style.backgroundColor = item.color;
              }
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
      $(this.rows! , 'div', 'table-row', {}, (q) => {
        Object.entries(item).forEach(([key, element]) => {
          if (key === 'color') {
            return;
          }
          const cell = $(q, 'span', 'table-cell', {}, element!.toString());
          if (item.pendingReports && key === 'pendingReports') {
            cell.style.backgroundColor = item.color;
          }
        });
      });
    });
  }
}