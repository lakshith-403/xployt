import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './breadcrumbs.scss';

interface Breadcrumb {
  label: string;
  link: string;
  clickable?: boolean;
}

export class Breadcrumbs {
  private static instance: Breadcrumbs;
  private breadcrumbs: Breadcrumb[] = [];

  // Private constructor to prevent direct instantiation
  private constructor() {
    console.log('Breadcrumbs constructor');
  }

  // Static method to get the single instance of the class
  public static getInstance(): Breadcrumbs {
    if (!Breadcrumbs.instance) {
      Breadcrumbs.instance = new Breadcrumbs();
    }
    return Breadcrumbs.instance;
  }

  // Method to add a breadcrumb
  public addBreadcrumb(breadcrumb: Breadcrumb): void {
    console.log('adding breadcrumb', breadcrumb.label, breadcrumb.link);
    const lengthOfBreadcrumbs = Breadcrumbs.instance.breadcrumbs.length;
    Breadcrumbs.instance.breadcrumbs[lengthOfBreadcrumbs] = { label: breadcrumb.label, link: breadcrumb.link, clickable: breadcrumb.clickable ?? true };
    console.log('breadcrumbs', Breadcrumbs.instance.breadcrumbs.toString());
    Breadcrumbs.render();
  }

  // Method to remove the last breadcrumb
  public popBreadcrumb(): void {
    Breadcrumbs.instance.breadcrumbs.pop();
    Breadcrumbs.render();
  }

  // Method to clear all breadcrumbs
  public clearBreadcrumbs(): void {
    Breadcrumbs.instance.breadcrumbs = [];
    Breadcrumbs.render();
  }

  // Method to render the breadcrumbs
  public static render(): void {
    console.log('rendering breadcrumbs');
    const container = document.getElementById('breadcrumbs-container') as HTMLElement;
    if (!container) return;
    console.log('inside breadcrumbs', Breadcrumbs.instance.breadcrumbs);
    container.innerHTML = ''; // Clear existing breadcrumbs

    // Render breadcrumbs from bottom to top
    for (let i = Breadcrumbs.instance.breadcrumbs.length - 1; i >= 0; i--) {
      const breadcrumb = Breadcrumbs.instance.breadcrumbs[i];
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

// Export the singleton instance
export const BREADCRUMBS = Breadcrumbs.getInstance();
