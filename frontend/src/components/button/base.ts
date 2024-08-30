import { Quark, QuarkFunction as $ } from "../../ui_lib/quark"

export enum ButtonType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  QUATERNARY = 'quaternary',
}

export interface ButtonOptions {
  label: string
  onClick: () => void
  type?: ButtonType
}

export class Button {
  protected label: string
  protected onClick: () => void
  protected type: ButtonType
  protected element?: Quark

  constructor(options: ButtonOptions) {
    this.label = options.label
    this.onClick = options.onClick
    this.type = options.type || ButtonType.PRIMARY
  }

  set disabled(disabled: boolean) {
    if (disabled) {
      this.element?.classList.add('disabled')
    } else {
      this.element?.classList.remove('disabled')
    }
  }

  render(parent: Quark) {
    this.element = $(parent, 'button', `button-${this.type}`,{}, this.label)
    this.element.addEventListener('click', this.onClick)
  }
}