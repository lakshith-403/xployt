import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import { router } from '../../ui_lib/router';
import { FilterableTable } from './filterable.table';

interface ContentItem {
  id: number; // or string, depending on your requirements
  [key: string]: any; // Allow other fields
}

interface CustomTableParams {
  content: ContentItem[];
  headers: string[];
  className: string;
  options: Options;
}

interface Options {
  callback?: (args: any) => void;
  filteredField?: string; // Made optional
  falseKeys?: string[]; // Made optional
  noDataMessage?: string;
}

export class CustomTable {
  content: ContentItem[];
  headers: string[];
  className: string;
  options: Options;
  rows?: HTMLElement;

  constructor(params: CustomTableParams) {
    this.content = params.content;
    this.headers = params.headers;
    this.className = params.className;
    this.options = params.options;

    // Set filteredField and falseKeys if options are provided
    if (this.options.filteredField && !this.options.falseKeys) {
      console.error('filteredField and falseKeys are required');
    }
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
        if (this.content.length === 0) {
          this.displayNoDataMessage(q);
          return;
        }

        this.content.forEach((item) => {
          console.log('item', item);
          if (this.options.filteredField && this.options.falseKeys) {
            for (const key of this.options.falseKeys) {
              if (key === item[this.options.filteredField]) {
                console.log('Filtered key', key);
                return;
              }
            }
          }
          $(q, 'a', 'table-row-link', {}, (q) => {
            const row = $(q, 'div', 'table-row', {}, (q) => {
              this.displayItems(item, q);
            });
            if (this.options.callback) {
              row.addEventListener('click', () => {
                this.options.callback!(item);
              });
            }
          });
        });
      });
    });
  }

  public updateRows(checkboxState: { [key: string]: boolean }): void {
    console.log('Updating rows');
    console.log('checkboxState', checkboxState);
    this.rows!.innerHTML = '';
    this.content.forEach((item) => {
      const falseKeys = this.getFalseKeys(checkboxState);
      console.log('falseKeys', falseKeys);
      if (falseKeys.includes(item[this.options.filteredField!])) return;

      $(this.rows!, 'a', 'table-row-link', {}, (q) => {
        const row = $(q, 'div', 'table-row', {}, (q) => {
          this.displayItems(item, q);
        });
        if (this.options.callback) {
          row.addEventListener('click', () => {
            this.options.callback!(item);
          });
        }
      });
    });
    if (!this.rows || this.rows.innerHTML === '') {
      if (this.options.noDataMessage) {
        this.displayNoDataMessage(this.rows!);
      }
      return;
    }
  }

  protected getFalseKeys(obj: { [key: string]: boolean }): string[] {
    const keys = Object.keys(obj).filter((key) => !obj[key]);
    console.log('keys', keys);
    return keys;
  }

  private displayItems(object: Record<string, any>, q: Quark) {
    Object.keys(object).forEach((key: string) => {
      const element = object[key];
      const cellContent =
        typeof element === 'string' ? element : typeof element === 'object' && element !== null && typeof element.render === 'function' ? element.render(q) : String(element) ?? '-';
      $(q, 'span', 'table-cell', {}, cellContent);
    });
  }

  private displayNoDataMessage(q: Quark) {
    $(q, 'div', 'table-row', {}, (q) => {
      $(q, 'span', 'table-cell last-cell text-center', {}, this.options.noDataMessage);
    });
  }
}
