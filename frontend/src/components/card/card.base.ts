import { Quark, QuarkFunction as $ } from '../../ui_lib/quark';
import './card.base.scss';

export interface CardOptions {
    title: string;
    content: HTMLElement;
    extraInfo?: string;
}

export class Card {
    protected title: string;
    protected content: HTMLElement;
    protected extraInfo?: string;
    protected element?: Quark;

    constructor(options: CardOptions) {
        this.title = options.title;
        this.content = options.content;
        this.extraInfo = options.extraInfo || '';
    }

    render(parent: Quark) {
        this.element = $(parent, 'div', 'card', {}, (q) => {
            $(q, 'p', 'card-title', {}, this.title);
            $(q, 'div', 'card-content', {}, (q) => {
                q.appendChild(this.content);
            });
            if (this.extraInfo) {
                $(q, 'p', 'card-extra', {}, this.extraInfo);
            }
        });
    }
}
