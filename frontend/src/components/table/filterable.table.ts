import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import { tableBase } from './table.base';

export class FilterableTable extends tableBase {
  checkboxState: { [key: string]: boolean };
  falseKeys: string[] = [];
  filteredField: string = '';
  rows?: HTMLElement;

  constructor(content: Record<string, any>[], headers: string[], checkboxState: { [key: string]: boolean }, filteredFiled: string, className: string = '') {
    super(content, headers, className);
    this.checkboxState = checkboxState;
    this.falseKeys = this.getFalseKeys(checkboxState);
    this.filteredField = filteredFiled;
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
            // console.log('key check', key);
            // console.log('item check', item[this.filteredField]);
            if (key === item[this.filteredField]) {
              return;
            }
          }
          $(q, 'div', 'table-row', {}, (q) => {
            Object.values(item).forEach((element) => {
              $(q, 'span', 'table-cell', {}, element!.toString());
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
        Object.values(item).forEach((element) => {
          $(q, 'span', 'table-cell', {}, element!.toString());
        });
      });
    });
  }
  protected getFalseKeys(obj: { [key: string]: boolean }): string[] {
    const keys = Object.keys(obj).filter((key) => !obj[key]);
    // console.log('keys', keys);
    return keys;
  }
}
