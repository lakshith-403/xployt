import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import { loginViewHandler } from '@views/Login';
import { User } from '@data/user';
import { CACHE_STORE } from '@data/cache';

interface ContentItem {
  // id: number; // or string, depending on your requirements
  [key: string]: any; // Allow other fields
  render?: (q: Quark) => void;
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
  orderKeys?: string[]; // New option for specifying order
  lastLine?: boolean;
  cellClassName?: string;
  clickable?: boolean;
  cellClassNames?: { [key: number]: string } | { [key: number]: (key: string, userType: string) => string };
}

export class CustomTable {
  user!: User;
  content: ContentItem[];
  headers: string[];
  className: string;
  options: Options;
  rows?: HTMLElement;
  clickable?: boolean;

  constructor(params: CustomTableParams) {
    this.content = params.content;
    this.headers = params.headers;
    this.className = params.className;
    this.options = params.options;
    this.clickable = params.options.clickable ?? true;

    // Set filteredField and falseKeys if options are provided
    if (this.options.filteredField && !this.options.falseKeys) {
      console.error('filteredField and falseKeys are required');
    }
    if (this.options.orderKeys && this.options.orderKeys.length !== this.headers.length) {
      console.error('orderKeys length must match headers length');
    }
  }

  public async render(q: Quark): Promise<void> {
    this.user = await CACHE_STORE.getUser().get();
    $(q, 'div', `table ${this.className}`, {}, (q) => {
      if (this.headers && this.headers.length > 0) {
        $(q, 'div', 'table-header', {}, (q) => {
          this.headers!.forEach((header) => {
            $(q, 'span', 'table-header-cell', {}, header);
          });
        });
      }

      this.rows = $(q, 'div', 'table-rows', {}, (q) => {
        if (!this.content || this.content.length === 0) {
          this.displayNoDataMessage(q);
          return;
        }
        // console.log('content', this.content);
        this.content.forEach((item, index) => {
          // console.log('item', item);
          const isLastRow = index === this.content.length - 1 && this.options.lastLine === false;

          $(q, 'a', 'table-row-link', {}, (q) => {
            const row = $(q, 'div', `table-row${isLastRow ? ' no-border' : ''}`, {}, (q) => {
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
    // console.log('Updating rows');
    // console.log('checkboxState', checkboxState);
    this.rows!.innerHTML = '';
    if (!this.content || this.content.length === 0) {
      this.displayNoDataMessage(this.rows!);
      return;
    }

    const filteredContent = this.content.filter((item) => {
      const falseKeys = this.getFalseKeys(checkboxState);
      // console.log('falseKeys', falseKeys);
      return !falseKeys.includes(item[this.options.filteredField!]);
    });

    filteredContent.forEach((item, index) => {
      const isLastRow = index === filteredContent.length - 1 && this.options.lastLine === false;

      $(this.rows!, 'a', 'table-row-link', {}, (q) => {
        const row = $(q, 'div', `table-row${isLastRow ? ' no-border' : ''}`, {}, (q) => {
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
    // console.log('keys', keys);
    return keys;
  }

  private displayItems(object: Record<string, any>, q: Quark) {
    const keys = Object.keys(object);
    // console.log('keys', keys);
    // If orderKeys is provided, reorder keys based on it
    const orderedKeys = this.options.orderKeys ? this.options.orderKeys.filter((key) => keys.includes(key)) : keys;
    // console.log('orderedKeys', orderedKeys);
    orderedKeys.forEach((key: string, index: number) => {
      const element = object[key];
      // Determine the cell class
      const cellClass = this.options.cellClassNames
        ? typeof this.options.cellClassNames[index] === 'function'
          ? (this.options.cellClassNames[index] as (key: string, user: string) => string)(element, this.user.type)
          : typeof this.options.cellClassNames[index] === 'string'
          ? this.options.cellClassNames[index]
          : ''
        : '';

      switch (typeof element) {
        case 'string':
          $(q, 'span', `table-cell text-center ${cellClass} ${this.clickable ? 'cursor-pointer' : ''}`, {}, element == 'null' ? '-' : element);
          break;
        case 'object':
          $(q, 'span', `table-cell text-center ${cellClass} ${this.clickable ? 'cursor-pointer' : ''}`, {}, (q) => {
            if (element !== null && typeof element.render === 'function') {
              element.render(q);
            }
          });
          break;
        default:
          $(q, 'span', `table-cell text-center ${cellClass} ${this.clickable ? 'cursor-pointer' : ''}`, {}, String(element) ?? '-');
      }
    });
  }

  private displayNoDataMessage(q: Quark) {
    $(q, 'div', 'table-row', {}, (q) => {
      $(q, 'span', 'table-cell last-cell text-center', {}, this.options.noDataMessage);
    });
  }
}
