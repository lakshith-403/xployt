import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './loadingScreen.scss';
export default class LoadingScreen {
  private container: HTMLElement;
  private static body: HTMLElement;
  private static instance: HTMLElement;

  constructor(q: Quark) {
    this.container = $(q, 'div', 'loading-screen', {}, (q) => {
      $(q, 'div', 'spinner', {}, (q) => {});
    });
    this.container.style.display = 'none';
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

  static show() {
    if (!this.instance) {
      this.instance = $(this.getBody(), 'div', 'loading-screen', {}, (q) => {
        $(q, 'div', 'spinner', {}, (q) => {});
      });
    }
    this.instance.style.display = 'flex';
  }

  static hide() {
    if (this.instance) {
      this.instance.style.display = 'none';
    }
  }

  static getBody() {
    if (this.body) {
      return this.body;
    }
    this.body = document.querySelector('body')!;
    return this.body;
  }
}
