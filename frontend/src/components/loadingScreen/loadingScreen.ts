import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './loadingScreen.scss';
export default class LoadingScreen {
  private container: HTMLElement;
  private static body: HTMLElement;
  private static instance: HTMLElement;
  private static localInstances: Map<string, HTMLElement> = new Map();

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

  static showLocal(elementId: string) {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) {
      console.error(`Element with ID "${elementId}" not found`);
      return;
    }

    if (!this.localInstances.has(elementId)) {
      // Set the target element to position relative if it's not already
      const currentPosition = window.getComputedStyle(targetElement).position;
      if (currentPosition === 'static') {
        targetElement.style.position = 'relative';
      }

      // Create a new loading screen within the target element
      const localLoadingScreen = document.createElement('div');
      localLoadingScreen.className = 'loading-screen-local';

      const spinner = document.createElement('div');
      spinner.className = 'spinner';
      localLoadingScreen.appendChild(spinner);

      targetElement.appendChild(localLoadingScreen);
      this.localInstances.set(elementId, localLoadingScreen);
    }

    const localInstance = this.localInstances.get(elementId);
    if (localInstance) {
      localInstance.style.display = 'flex';
    }
  }

  static hideLocal(elementId: string) {
    const localInstance = this.localInstances.get(elementId);
    if (localInstance) {
      localInstance.style.display = 'none';
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
