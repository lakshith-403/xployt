import { Quark } from '@/ui_lib/quark';

export class Loader {
  private loaderElem: Quark;

  constructor() {
    this.loaderElem = document.createElement('div');
    this.loaderElem.className = 'loader';
    this.loaderElem.innerText = 'Loading...';
    this.loaderElem.style.display = 'none';
  }

  show(parent: Quark): void {
    this.loaderElem.style.display = 'block';
    parent.appendChild(this.loaderElem);
  }

  hide(): void {
    this.loaderElem.style.display = 'none';
  }
}
