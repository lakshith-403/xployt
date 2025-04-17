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
      overlayClass: options.overlayClass ? this.mergeClasses(this.defaultOverlayClass, options.overlayClass) : this.defaultOverlayClass,
      contentClass: options.contentClass ? this.mergeClasses(this.defaultContentClass, options.contentClass) : this.defaultContentClass,
    };
  }

  private mergeClasses(defaultClasses: string, customClasses: string): string {
    const defaultClassArray = defaultClasses.split(' ');
    const customClassArray = customClasses.split(' ');

    // Custom classes override defaults if they specify the same property
    customClassArray.forEach((customClass) => {
      const [property] = customClass.split('-');
      const defaultIndex = defaultClassArray.findIndex((defaultClass) => defaultClass.startsWith(property + '-'));
      if (defaultIndex !== -1) {
        defaultClassArray.splice(defaultIndex, 1);
      }
    });

    return [...defaultClassArray, ...customClassArray].join(' ');
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
