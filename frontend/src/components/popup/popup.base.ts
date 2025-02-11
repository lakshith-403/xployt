import { Quark } from '@ui_lib/quark';
import { PopupOverlay } from './popup.overlay';
import './popup.scss';
import { Button } from "@components/button/base";

export interface PopupOptions {
    overlayContent: Quark;
    label: string;
    disable?: boolean;
}

export class Popup {
    protected isVisible: boolean;
    private popUpOverlay: PopupOverlay;
    private readonly label: string;
    public disable: boolean;
    private button: Button;
    private container: Quark | null = null;

    constructor(popupOptions: PopupOptions) {
        this.isVisible = false;
        this.popUpOverlay = new PopupOverlay(this.isVisible, popupOptions.overlayContent);
        this.label = popupOptions.label;
        this.disable = popupOptions.disable ?? false;
        this.button = new Button({
            label: this.label,
            onClick: () => {
                if (!this.disable) {
                    console.log('clicked');
                    this.popUpOverlay.toggleVisibility();
                }
            },
        });
    }

    render(container: Quark): void {
        this.container = container;
        this.button.render(this.container);
        !this.disable && this.popUpOverlay.render(this.container);
    }
}
