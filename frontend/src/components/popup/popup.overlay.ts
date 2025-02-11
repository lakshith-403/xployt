import {Quark, QuarkFunction as $} from "@ui_lib/quark";
import {IconButton} from "@components/button/icon.button";

export class PopupOverlay {
    private content:  Quark;
    public isVisible: boolean;
    private element?: Quark;

    constructor(isVisible: boolean, content: Quark) {
        this.content = content;
        this.isVisible = isVisible;
    }

    toggleVisibility(): void {
        this.isVisible = !this.isVisible;
        if (this.element) {
            this.element.style.display = this.isVisible ? 'flex' : 'none';
        }
    }

    render(parent: Quark): void {
        if (this.element) {
            this.element.remove();
        }

        $(parent, 'div', 'popup-overlay', {style: "display: none"}, (overlay) => {
            this.element = overlay;

            $(overlay, 'div', 'popup-content', {}, (q) => {

                new IconButton({
                    icon: "fa-solid fa-xmark fa-2xl",
                    label: '',
                    onClick: () => this.toggleVisibility(),
                }).render(q)

                $(q, 'div', '', {}, (q) => {
                    q.appendChild(this.content);
                })
            });
        });
    }
}
