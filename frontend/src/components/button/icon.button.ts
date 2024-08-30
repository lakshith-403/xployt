import { Quark, QuarkFunction as $ } from "../../ui_lib/quark";
import { Button, ButtonOptions } from "./base";

export interface IconButtonOptions extends ButtonOptions {
  icon: string
}

export class IconButton extends Button {
  private icon: string

  constructor(options: IconButtonOptions) {
    super(options)
    this.icon = options.icon
  }
  
  render(parent: Quark) {
    super.render(parent)

    this.element?.classList.add('icon-button')
    let icon = $(this.element!, 'i', this.icon, {}, '')

    this.element!.innerHTML = ''
    this.element!.appendChild(icon)
  }
}