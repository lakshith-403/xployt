import { CACHE_STORE } from '@/data/cache';
import { extractPathParams, extractQueryParams, matchUrl, matchUrlWithBase } from './utils';
import { ViewHandler } from './view';
import { NavigationView } from './view';
import { router } from './router';
/**
 * Handles routing logic for a specific route and its associated view handlers.
 */
export class RouteHandler {
  route: string;
  viewHandlers: ViewHandler[];
  navigationView?: NavigationView;
  hideTopNavigation: boolean = false;
  hideFooter: boolean = false;
  hideBreadCrumbs: boolean = true;
  isProtected: boolean = false;

  /**
   * Creates an instance of RouteHandler.
   *
   * @param route - The route path that this handler manages.
   * @param viewHandlers - An array of sub view handlers associated with this route.
   * @param navigationView - The sidebar navigation view to render for this route.
   * @param hideTopNavigation - Whether to hide the top navigation bar.
   * @param hideFooter - Whether to hide the footer.
   */
  constructor(
    route: string,
    viewHandlers: ViewHandler[],
    navigationView?: NavigationView,
    hideTopNavigation: boolean = false,
    hideFooter: boolean = false,
    hideBreadCrumbs: boolean = true,
    isProtected: boolean = false
  ) {
    this.route = route;
    this.viewHandlers = viewHandlers;
    this.navigationView = navigationView;
    this.hideTopNavigation = hideTopNavigation;
    this.hideFooter = hideFooter;
    this.hideBreadCrumbs = hideBreadCrumbs;
    this.isProtected = isProtected;
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
  public async render(url: string): Promise<boolean> {
    if (this.isProtected) {
      console.log('trying protected route');
      const user = await CACHE_STORE.getUser().get();
      if (user.type === 'Guest') {
        throw new Error('Guest user cannot access protected route');
      }
    }

    for (const viewHandler of this.viewHandlers) {
      // console.log('checking view:', viewHandler.route);
      // console.log('checking url:', url, this.route, '+', viewHandler.route);
      if (matchUrl(url, this.route + viewHandler.route)) {
        // console.log('rendering view:', viewHandler.route);
        if (this.navigationView) {
          document.getElementById('sidebar')!.innerHTML = '';
          document.getElementById('sidebar')!.style.display = '';
          this.navigationView.render(document.getElementById('sidebar')!, viewHandler.route);
          document.getElementById('root')!.querySelector('#content')!.classList.remove('no-sidebar');
        } else {
          document.getElementById('sidebar')!.innerHTML = '';
          document.getElementById('sidebar')!.style.display = 'none';
          document.getElementById('root')!.querySelector('#content')!.classList.add('no-sidebar');
        }

        if (this.hideTopNavigation) {
          document.getElementById('navbar')!.style.display = 'none';
          document.getElementById('root')!.querySelector('#content')!.classList.add('no-navbar');
        } else {
          document.getElementById('navbar')!.style.display = '';
        }

        if (this.hideFooter) {
          document.getElementById('footer')!.style.display = 'none';
        } else {
          document.getElementById('footer')!.style.display = '';
        }
        if (this.hideBreadCrumbs) {
          document.getElementById('breadcrumbs-container')!.style.display = 'none';
        } else {
          document.getElementById('breadcrumbs-container')!.style.display = '';
        }

        viewHandler.setView({
          ...extractQueryParams(url),
          ...extractPathParams(url, this.route + viewHandler.route),
        });
        return true;
      }
    }

    return false;

    // throw new Error('No view handler found for route: ' + url);
  }
}
