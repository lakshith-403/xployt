import { extractPathParams, extractQueryParams, matchUrl, matchUrlWithBase } from './utils';
import { ViewHandler } from './view';
import { NavigationView } from './view';

/**
 * Handles routing logic for a specific route and its associated view handlers.
 */
export class RouteHandler {
  route: string;
  viewHandlers: ViewHandler[];
  navigationView: NavigationView;

  /**
   * Creates an instance of RouteHandler.
   *
   * @param route - The route path that this handler manages.
   * @param viewHandlers - An array of sub view handlers associated with this route.
   * @param navigationView - The sidebar navigation view to render for this route.
   */
  constructor(route: string, viewHandlers: ViewHandler[], navigationView: NavigationView) {
    this.route = route;
    this.viewHandlers = viewHandlers;
    this.navigationView = navigationView;
  }

  /**
   * Checks if the given URL matches the route.
   *
   * @param url - The URL to check against the route.
   * @returns True if the URL matches the route; otherwise, false.
   */
  public doesMatch(url: string): boolean {
    return matchUrlWithBase(url, this.route);
  }

  /**
   * Renders the appropriate view based on the provided URL.
   *
   * @param url - The URL to render the view for.
   * @throws Error if no view handler is found for the route.
   */
  public render(url: string, currentRoute: string): void {
    // if (currentRoute !== this.route) {
    // console.log('CurrentRoute:', currentRoute, 'Route:', this.route);
    // }
    // console.log('rendering sub route:', url);
    for (const viewHandler of this.viewHandlers) {
      if (matchUrl(url, this.route + viewHandler.route)) {
        document.getElementById('sidebar')!.innerHTML = '';
        this.navigationView.render(document.getElementById('sidebar')!, viewHandler.route);
        viewHandler.setView({
          ...extractQueryParams(url),
          ...extractPathParams(url, this.route + viewHandler.route),
        });
        return;
      }
    }

    throw new Error('No view handler found for route: ' + url);
  }
}
