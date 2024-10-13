import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './checkboxManager.scss';
import { Checkbox } from './checkbox';

export class CheckboxManager {
  private state: { [key: string]: boolean } = {};
  private onChangeCallback: (checkboxValues: { [key: string]: boolean }) => void;
  private checkboxes: { [key: string]: Checkbox } = {};

  constructor(keys: string[], onChangeCallback: (checkboxValues: { [key: string]: boolean }) => void) {
    this.onChangeCallback = onChangeCallback;
    keys.forEach((key) => {
      this.state[key] = true;
      this.checkboxes[key] = new Checkbox({
        label: key,
        checked: true,
        onChange: (checked) => {
          this.state[key] = checked;
          this.onChangeCallback(this.state);
        },
      });
    });
  }

  render(q: Quark) {
    const container = document.createElement('span');
    container.className = 'checkbox-container';

    Object.keys(this.checkboxes).forEach((key) => {
      this.checkboxes[key].render(container);
    });

    q.appendChild(container);
  }

  getState(): { [key: string]: boolean } {
    return this.state;
  }
}
