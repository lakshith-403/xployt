import { CollapsibleBase } from './CollapsibleBase';
import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './Collapsible.scss';

export class reportsCollabsible extends CollapsibleBase<Record<string, any>> {
  constructor(q: Quark, title: string, content: Record<string, any>[], headers: string[], className?: string) {
    super(q, title, content, headers, className);
  }

  protected renderContentItem(q: Quark, item: Record<string, any>): HTMLElement {
    console.log('item:', item);
    const row = $(q, 'div', 'collapsible-row', {});
    Object.values(item).forEach((element) => {
      if (element === item.color) {
        return;
      }
      const cell = $(row, 'span', 'collapsible-cell', {}, element!.toString());
      // console.log('element:', element);
      console.log('item:', item.pending_reports);
      if (element === item.pendingReports) {
        console.log('pending_reports:', item.pending_reports);
        cell.style.backgroundColor = item.color; // Set background color based on color property
      }
    });
    return row;
  }
}
