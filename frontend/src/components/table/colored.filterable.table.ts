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
              const cell = $(q, 'span', 'table-cell', {}, (q) => {
                $(q, 'span', 'table-cell-text', {}, element!.toString());
              });

              if (item.pendingReports && key === 'pendingReports') {
                cell.style.backgroundColor = item.color;
                cell.style.padding = '5px 10px';
                cell.style.borderRadius = '5px';
                cell.style.fontWeight = 'bold';
                cell.style.textAlign = 'center';
                cell.style.display = 'flex'; // Use flexbox for centering
                cell.style.alignItems = 'center'; // Center vertically
                cell.style.justifyContent = 'center'; // Center horizontally
                cell.style.position = 'relative'; // Allows for z-index and float effect
                cell.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'; // Add shadow for float effect
                cell.style.margin = '5px'; // Add space around the cell to enhance the floating look
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
      $(this.rows!, 'div', 'table-row', {}, (q) => {
        Object.entries(item).forEach(([key, element]) => {
          if (key === 'color') {
            return;
          }
          const cell = $(q, 'span', 'table-cell', {}, (q) => {
            $(q, 'span', 'table-cell-text', {}, element!.toString());
          });

          if (item.pendingReports && key === 'pendingReports') {
            cell.style.backgroundColor = item.color;
            cell.style.padding = '5px 10px';
            cell.style.borderRadius = '5px';
            cell.style.fontWeight = 'bold';
            cell.style.textAlign = 'center';
            cell.style.display = 'flex'; // Use flexbox for centering
            cell.style.alignItems = 'center'; // Center vertically
            cell.style.justifyContent = 'center'; // Center horizontally
            cell.style.position = 'relative'; // Allows for z-index and float effect
            cell.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'; // Add shadow for float effect
            cell.style.margin = '5px'; // Add space around the cell to enhance the floating look
          }
        });
      });
    });
  }
}