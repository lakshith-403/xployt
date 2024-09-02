import { CollapsibleBase } from './CollapsibleBase';
import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './Collapsible.scss';

export class reportsCollabsible extends CollapsibleBase<Record<string, any>> {
  constructor(q: Quark, title: string, content: Record<string, any>[], headers: string[], className?: string) {
    super(q, title, content, headers, className);
  }

  protected renderContentItem(q: Quark, item: Record<string, any>): void {
    $(q, 'div', 'collapsible-row', {}, (q) => {
      Object.values(item).forEach((element) => {
        $(q, 'span', 'collapsible-cell', {}, element!.toString());
      });
    });
  }
}
