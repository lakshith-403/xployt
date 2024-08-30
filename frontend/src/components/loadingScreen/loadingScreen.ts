import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './loadingScreen.scss';
export default class LoadingScreen {
  private container: HTMLElement;

  constructor(q: Quark) {
    this.container = $(q, 'div', 'loading-screen', {}, (q) => {
      $(q, 'div', 'spinner', {}, (q) => {});
    });
  }

  // Method to remove the loading screen
  remove() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }

  // Method to hide the loading screen
  hide() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  // Method to show the loading screen
  show() {
    if (this.container) {
      this.container.style.display = 'flex';
    }
  }
}
