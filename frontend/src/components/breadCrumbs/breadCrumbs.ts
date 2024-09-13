import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './breadcrumbs.scss';

interface Breadcrumb {
  label: string;
  link: string;
  clickable?: boolean;
}

class Breadcrumbs {
  private breadcrumbs: Breadcrumb[] = [];

  // Method to add a breadcrumb
  public addBreadcrumb(breadcrumb: Breadcrumb): void {
    console.log('adding breadcrumb', breadcrumb.label, breadcrumb.link);
    const lengthOfBreadcrumbs = this.breadcrumbs.length;
    this.breadcrumbs[lengthOfBreadcrumbs] = { label: breadcrumb.label, link: breadcrumb.link, clickable: breadcrumb.clickable ?? true };
    console.log('breadcrumbs', this.breadcrumbs.toString());
    this.render();
  }

  // Method to remove the last breadcrumb
  public popBreadcrumb(): void {
    this.breadcrumbs.pop();
    this.render();
  }

  // Method to clear all breadcrumbs
  public clearBreadcrumbs(): void {
    this.breadcrumbs = [];
    this.render();
  }

  // Method to render the breadcrumbs
  public render(): void {
    console.log('rendering breadcrumbs');
    const container = document.getElementById('breadcrumbs-container') as HTMLElement;
    if (!container) return;
    console.log('inside breadcrumbs', this.breadcrumbs);
    container.innerHTML = ''; // Clear existing breadcrumbs

    // Render breadcrumbs from bottom to top
    for (let i = this.breadcrumbs.length - 1; i >= 0; i--) {
      const breadcrumb = this.breadcrumbs[i];
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

      if (i > 0) {
        const separator = document.createElement('span');
        separator.className = 'breadcrumb-separator';
        separator.textContent = ' > ';
        container.appendChild(separator);
      }
    }
  }
}

export const BREADCRUMBS = new Breadcrumbs();
