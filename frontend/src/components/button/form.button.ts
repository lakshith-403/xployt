import { Button, ButtonOptions } from './base';
import { Quark } from './../../ui_lib/quark';
import './form.button.scss';

export class FormButton extends Button {
  constructor(options: ButtonOptions) {
    super(options);
  }

  public setClass(className: string) {
    this.element!.classList.add(className);
  }

  public isHidden() {
    return this.element?.style.display === 'none';
  }

  public hide() {
    this.element!.style.display = 'none';
  }

  public show() {
    this.element!.style.display = 'block';
  }

  render(parent: Quark) {
    super.render(parent);
    this.element!.classList.add('form-button');
  }
}
