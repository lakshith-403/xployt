import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './checkbox.scss';

interface CheckboxOptions {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export class Checkbox {
  private label: string;
  private checked: boolean;
  private onChangeCallback?: (checked: boolean) => void;
  private checkbox?: Quark;

  constructor(options: CheckboxOptions) {
    this.label = options.label;
    this.checked = options.checked ?? false;
    this.onChangeCallback = options.onChange;
  }

  render(q: Quark) {
    $(q, 'div', 'checkbox', {}, (q) => {
      $(q, 'label', '', {}, (q) => {
        this.checkbox = $(q, 'input', '', { type: 'checkbox', checked: this.checked }, (q) => {
          q.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement;
            this.checked = target.checked;
            if (this.onChangeCallback) {
              this.onChangeCallback(this.checked);
            }
          });
        });
        $(q, 'span', '', {}, this.label);
      });
    });

    this.setChecked(this.checked);
  }

  setChecked(checked: boolean) {
    (this.checkbox as HTMLInputElement)!.checked = checked;
  }

  toggle() {
    this.checked = !this.checked;
  }

  getChecked(): boolean {
    return this.checked;
  }
}
