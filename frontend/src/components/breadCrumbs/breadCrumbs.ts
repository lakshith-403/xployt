import './breadCrumbs.scss';
import { QuarkFunction as $ } from '../../ui_lib/quark';
import { router } from '@ui_lib/router';
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
    const q = document.getElementById('breadcrumbs-container');
    if (!q) return;
    q.innerHTML = '';
    this.breadcrumbs.forEach((breadcrumb, index) => {
      const isLast = index === this.breadcrumbs.length - 1;
      let className = '';
      if (isLast) {
        className += ' last';
      } else {
        className += ' pre-crumb';
      }

      $(q, 'span', 'breadcrumb', {}, (q) => {
        if (breadcrumb.clickable) {
          $(q, 'a', className, { href: breadcrumb.link }, breadcrumb.label).addEventListener('click', (event) => {
            event.preventDefault();
            router.navigateTo(breadcrumb.link);
          });
        } else {
          $(q, 'span', className, {}, breadcrumb.label);
        }
      });

      if (!isLast) {
        $(q, 'span', 'breadcrumb-separator', {}, (q) => {
          $(q, 'span', '', {}, ' > ');
        });
      }
    });
  }
}

export const BREADCRUMBS = Breadcrumbs.getInstance();
