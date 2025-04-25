import { Quark, QuarkFunction as $ } from '../../ui_lib/quark';
import './button.scss';

export enum ButtonType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  QUATERNARY = 'quaternary',
  ALTERNATE = 'alt',
}

export interface ButtonOptions {
  label: string;
  onClick: (event: Event) => void;
  type?: ButtonType;
  className?: string;
}

export class Button {
  protected label: string;
  protected onClick: (event: Event) => void;
  protected type: ButtonType;
  protected element?: Quark;
  protected className?: string;

  constructor(options: ButtonOptions) {
    this.label = options.label;
    this.onClick = options.onClick;
    this.type = options.type || ButtonType.PRIMARY;
    this.className = options.className || '';
  }

  set disabled(disabled: boolean) {
    if (disabled) {
      this.element?.classList.add('disabled');
      this.element?.addEventListener('click', this.onClick);
    } else {
      this.element?.classList.remove('disabled');
      this.element?.removeEventListener('click', this.onClick);
    }
  }

  render(parent: Quark) {
    this.element = $(parent, 'button', `button-${this.type} button-component ${this.className}`, {}, this.label);
    if (!this.disabled) this.element.addEventListener('click', this.onClick);
  }
}
