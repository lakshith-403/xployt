import { CollapsibleBase } from './CollapsibleBase';
import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './Collapsible.scss';

export class reportsCollabsible extends CollapsibleBase<Record<string, any>> {
  constructor(q: Quark, title: string, content: Record<string, any>[], headers: string[], className?: string) {
    super(q, title, content, headers, className);
  }

  protected renderContentItem(q: Quark, item: Record<string, any>): HTMLElement {
    const row = $(q, 'div', 'collapsible-row', {});
    Object.values(item).forEach((element) => {
      const cell = $(row, 'span', 'collapsible-cell', {}, element!.toString());
      if (element === item.pending_reports) {
        cell.style.backgroundColor = item.color; // Set background color based on color property
      }
    });
    return row;
  }
}
