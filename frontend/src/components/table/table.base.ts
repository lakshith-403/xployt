import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './Collapsible.scss';

export class tableBase {
  constructor(q: Quark, title: string, content: Record<string, any>[], headers: string[], className?: string) {}

  protected renderContentItem(q: Quark, item: Record<string, any>): void {
    $(q, 'div', 'collapsible-row', {}, (q) => {
      Object.values(item).forEach((element) => {
        $(q, 'span', 'collapsible-cell', {}, element!.toString());
      });
    });
  }
}
