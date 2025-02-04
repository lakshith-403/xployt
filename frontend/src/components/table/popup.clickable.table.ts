import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import { ContentItem, ClickableTable } from './clickable.table';
import { Popup } from '../popup/popup.base';

export class PopupTable extends ClickableTable {

    constructor(content: ContentItem[], headers: string[], className: string = '') {
        super(content, headers, className);
        //pass a popup component for each content item
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
            this.content.forEach((item) => {
                $(q, 'div', 'table-row', {}, (q) => {
                    Object.values(item).forEach((element, index) => {
                        if (typeof element === 'string' || typeof element === 'number') {
                            console.log('string', element)
                            $(q, 'span', 'table-cell', {}, element.toString());
                        } else if (element instanceof Popup) {
                            $(q, 'span', 'table-cell', {}, (q) => {
                                console.log('element', element)
                                element.render(q);
                            });
                        }
                    });
                });
            });
        });
    }
}

export { ContentItem };