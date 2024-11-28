import { Quark } from './quark';
import { Breadcrumbs, Breadcrumb } from '../components/breadCrumbs/breadCrumbs';

/**
 * Abstract class representing a generic view.
 * Subclasses must implement the render method to define how the view is displayed.
 */
export abstract class View {
  /**
   * Renders the view using the provided Quark instance.
   *
   * @param q - An instance of Quark used for rendering the view.
   */
  protected breadcrumbs?: Breadcrumbs;

  constructor(params?: any) {
    if (this.shouldRenderBreadcrumbs()) {
      this.breadcrumbs = Breadcrumbs.getInstance();
      this.setupBreadcrumbs(params);
    }
  }

  protected shouldRenderBreadcrumbs(): boolean {
    return true; // Default to not rendering breadcrumbs
  }

  protected setupBreadcrumbs(params?: any): void {
    this.breadcrumbs?.clearBreadcrumbs();
  }

  public abstract render(q: Quark): void;

  protected updateBreadcrumbs(breadcrumbInfo: Breadcrumb[]) {
    if (this.breadcrumbs) {
      this.breadcrumbs.clearBreadcrumbs();
      breadcrumbInfo.forEach((info) => this.breadcrumbs!.addBreadcrumb(info));
    }
  }
}

/**
 * Manages the rendering of views based on the current route.
 */
export class ViewHandler {
  route: string;
  private readonly builder: new (params: any) => View;
  private view?: View;
  private currentParams?: Record<string, string>;

  /**
   * Creates an instance of ViewHandler.
   *
   * @param route - The route path that this handler manages.
   * @param builder - A constructor function for creating a View instance.
   */
  constructor(route: string, builder: new (params: any) => View) {
    this.route = route;
    this.builder = builder;
    document.addEventListener('roleChanged', () => {
      if (this.view) {
        this.setView(this.currentParams);
      }
    });
  }

  /**
   * Sets the view for the current route and renders it.
   *
   * @param params - Optional parameters to pass to the view constructor.
   * @throws Error if the root element is not found in the DOM.
   */
  setView(params?: Record<string, string>) {
    let root = document.getElementById('content');
    this.currentParams = params;
    if (root == null) {
      throw new Error('Root element not found');
    }

    root.innerHTML = ''; // Clear the existing content

    this.view = new this.builder(params); // Create a new view instance
    this.view!.render(root); // Render the view into the root element
  }
}

export interface NavigationView {
  baseURL: string;
  // willUpdate: () => void
  render: ($: Quark, currentRoute: string) => void;
}
