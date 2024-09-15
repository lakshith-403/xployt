import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './breadcrumbs.scss';

export interface Breadcrumb {
  label: string;
  link: string;
  clickable?: boolean;
}

  export class Breadcrumbs {
  private static instance: Breadcrumbs;
  private breadcrumbs: Breadcrumb[] = [];

  private constructor() {}

  public static getInstance(): Breadcrumbs {
    if (!Breadcrumbs.instance) {
      Breadcrumbs.instance = new Breadcrumbs();
    }
    return Breadcrumbs.instance;
  }

  public addBreadcrumb(breadcrumb: Breadcrumb): void {
    this.breadcrumbs.push({ ...breadcrumb, clickable: breadcrumb.clickable ?? true });
    this.render();
  }

  public popBreadcrumb(): void {
    this.breadcrumbs.pop();
    this.render();
  }

  public clearBreadcrumbs(): void {
    this.breadcrumbs = [];
    this.render();
  }

  private render(): void {
    const container = document.getElementById('breadcrumbs-container');
    if (!container) return;

    container.innerHTML = '';

    this.breadcrumbs.slice().forEach((breadcrumb, index) => {
      const breadcrumbElement = document.createElement('span');
      breadcrumbElement.className = 'breadcrumb';

      if (breadcrumb.clickable) {
        const linkElement = document.createElement('a');
        linkElement.href = breadcrumb.link;
        linkElement.textContent = breadcrumb.label;
        breadcrumbElement.appendChild(linkElement);
      } else {
        breadcrumbElement.textContent = breadcrumb.label;
      }

      container.appendChild(breadcrumbElement);

      if (index < this.breadcrumbs.length - 1) {
        const separator = document.createElement('span');
        separator.className = 'breadcrumb-separator';
        separator.textContent = ' > ';
        container.appendChild(separator);
      }
    });
  }
}

export const BREADCRUMBS = Breadcrumbs.getInstance();
