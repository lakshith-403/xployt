import { QuarkFunction as $, Quark } from '@ui_lib/quark';

export interface PopupLiteOptions {
  overlayClass?: string;
  contentClass?: string;
  onClose?: () => void;
}

export class PopupLite {
  private overlay!: HTMLElement;
  private options: PopupLiteOptions;
  private defaultOverlayClass = 'position-fixed top-0 left-0 w-100 h-100 d-flex align-items-center justify-content-center bg-opacity-50';
  private defaultContentClass = 'position-relative mx-auto container-md bg-secondary px-3 py-2 rounded-3';

  constructor(options: PopupLiteOptions = {}) {
    this.options = {
      ...options,
      overlayClass: options.overlayClass ? `${this.defaultOverlayClass} ${options.overlayClass}` : this.defaultOverlayClass,
      contentClass: options.contentClass ? `${this.defaultContentClass} ${options.contentClass}` : this.defaultContentClass,
    };
  }

  render(parent: HTMLElement, content: (q: Quark) => void): void {
    this.overlay = $(parent, 'div', this.options.overlayClass || '', {}, (q) => {
      $(q, 'div', this.options.contentClass || '', {}, content);
    });

    this.overlay.addEventListener('click', (event: MouseEvent) => {
      if (event.target === this.overlay) {
        this.close();
      }
    });
  }

  close(): void {
    if (this.options.onClose) {
      this.options.onClose();
    }
    this.overlay.remove();
  }
}
