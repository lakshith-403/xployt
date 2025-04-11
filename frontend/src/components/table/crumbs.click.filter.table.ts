import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import { ClickableFilterableTable } from './clickable.filter.table';
import { BREADCRUMBS } from '../breadCrumbs/breadCrumbs';
import { router } from '../../ui_lib/router';

interface ContentItem {
  id: number; // or string, depending on your requirements
  [key: string]: any; // Allow other fields
}

export class ClickableFilterableTableWithCrumbs extends ClickableFilterableTable {
  public noDataMessage: string;

  constructor(
    content: ContentItem[],
    headers: string[],
    checkboxState: { [key: string]: boolean },
    filteredField: string,
    className: string = '',
    noDataMessage: string = 'No data available'
  ) {
    super(content, headers, checkboxState, filteredField, className);
    this.noDataMessage = noDataMessage;
  }

  public render(q: Quark): void {
    const tableElement = $(q, 'div', `table ${this.className}`, {});

    if (this.headers && this.headers.length > 0) {
      const headerElement = $(tableElement, 'div', 'table-header', {});
      this.headers!.forEach((header) => {
        $(headerElement, 'span', 'table-header-cell', {}, header);
      });
    }

    this.rows = $(tableElement, 'div', 'table-rows', {});

    if (!this.content || this.content.length === 0) {
      console.log('No data available');
      const noDataRow = $(this.rows, 'div', 'table-row', {});
      $(noDataRow, 'span', 'table-cell last-cell', {}, this.noDataMessage);
    } else {
      this.content.forEach((item) => {
        if (this.falseKeys.includes(item[this.filteredField])) return;

        const url = '/projects/' + item.id;
        const rowLink = $(this.rows!, 'a', 'table-row-link', {
          onclick: () => {
            this.updateCrumbs(item.id, url);
            router.navigateTo(url);
          },
        });

        const rowDiv = $(rowLink, 'div', 'table-row', {});
        Object.values(item).forEach((element) => {
          $(rowDiv, 'span', 'table-cell', {}, element ?? '-');
        });
      });
    }
  }

  protected updateCrumbs(id: string, url: string): void {
    BREADCRUMBS.addBreadcrumb({ label: 'Projects' + id, link: '/projects' + id });
    BREADCRUMBS.addBreadcrumb({ label: id, link: url });
  }

  public updateRows(checkboxState: { [key: string]: boolean }): void {
    this.falseKeys = this.getFalseKeys(checkboxState);
    if (!this.rows) return;

    this.rows.innerHTML = '';
    if (!this.content || this.content.length === 0) {
      console.log('No data available');
      const noDataRow = $(this.rows!, 'div', 'table-row', {});
      $(noDataRow, 'span', 'table-cell last-cell', {}, this.noDataMessage);
    } else {
      this.content.forEach((item) => {
        if (this.falseKeys.includes(item[this.filteredField])) return;

        const url = item.url; // Assuming the URL is stored in the 'url' field
        const rowLink = $(this.rows!, 'a', 'table-row-link', {});
        const rowDiv = $(rowLink, 'div', 'table-row', {});

        Object.values(item).forEach((element) => {
          if (typeof element.render === 'function') {
            element.render(rowDiv);
          } else {
            $(rowDiv, 'span', 'table-cell', {}, typeof element === 'string' ? element : String(element) ?? '-');
          }
        });

        rowLink.addEventListener('click', () => {
          router.navigateTo(url);
        });
      });
    }

    if (this.rows!.innerHTML === '') {
      const noDataRow = $(this.rows!, 'div', 'table-row', {});
      $(noDataRow, 'span', 'table-cell last-cell', {}, this.noDataMessage);
    }
  }
}
