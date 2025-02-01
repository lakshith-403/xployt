import {Quark, QuarkFunction as $} from "@ui_lib/quark";
import '../landing.scss'

export class LandingHowTo {
    private content: string[];

    constructor(content: string[]) {
        this.content = content;
    }

    render(q: Quark): void {
        // q.innerHTML = '';
        $(q, 'div', '', {id: 'how-to'}, (q) => {
            $(q, 'h1', '', {}, 'How it works?');
            $(q, 'div', 'how-to-content', {}, (q) => {
                for (const item in this.content) {
                    $(q, 'div', 'how-to-card', {}, (q) => {
                        $(q, 'div', 'number', {}, `${parseInt(item) + 1}`);
                        $(q, 'div', 'text', {}, this.content[item]);
                    });
                }
            })

        })
    }
}