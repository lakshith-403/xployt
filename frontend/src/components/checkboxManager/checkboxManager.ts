import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './checkboxManager.scss';
export class CheckboxManager {
  private state: { [key: string]: boolean } = {};
  private onChangeCallback: (checkboxValues: { [key: string]: boolean }) => void;

  constructor(keys: string[], onChangeCallback: (checkboxValues: { [key: string]: boolean }) => void) {
    this.onChangeCallback = onChangeCallback;
    keys.forEach((key) => {
      this.state[key] = true;
    });
  }

  render(q: Quark) {
    const container = document.createElement('span');
    container.className = 'checkbox-container';

    Object.keys(this.state).forEach((key) => {
      const label = document.createElement('label');
      label.textContent = key;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = this.state[key];
      checkbox.onchange = () => {
        this.state[key] = checkbox.checked;
        this.onChangeCallback(this.state);
      };

      label.appendChild(checkbox);
      container.appendChild(label);
    });

    q.appendChild(container);
  }

  getState(): { [key: string]: boolean } {
    return this.state;
  }
}
