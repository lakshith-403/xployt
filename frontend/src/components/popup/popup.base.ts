import { Quark, QuarkFunction as $ } from '../../ui_lib/quark';
import { PopupOverlay } from './popup.overlay';
import './popup.scss';
import {Button} from "@components/button/base";

export class Popup {
    protected isVisible: boolean;
    private popUpOverlay: PopupOverlay;

    constructor(overlayContent: Quark) {
        this.isVisible = false;
        this.popUpOverlay = new PopupOverlay(this.isVisible, overlayContent);
    }

    render(container: Quark): void {
        $(container, 'div', 'show-popup', {}, (q) => {
            new Button({
                label: 'Show Popup',
                onClick: () => {
                    this.isVisible = !this.isVisible;
                    this.popUpOverlay.toggleVisibility();
                }
            }).render(q);

            this.popUpOverlay.render(q);
        });
    }
}
