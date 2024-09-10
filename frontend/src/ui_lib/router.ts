import { RouteHandler } from './route';
import { NavigationView } from './view';
// import { Quark, QuarkFunction as $ } from './quark';
import NotFound from '../components/notFound/notFound';
import { Footer } from '../components/footer/footer';
/**
 * Represents a Router that manages navigation and route handling.
 */
export class Router {
  private readonly routeHandlers: RouteHandler[];
  private pathFound: boolean = false;
  public currentRoute: string = '';
  /**
   * Creates an instance of the Router.
   *
   * @param routeHandlers - An array of route handlers to manage navigation.
   * @param topNavigationView - The navigation view to render in the navbar.
   */
  constructor(routeHandlers: RouteHandler[] = [], topNavigationView: NavigationView) {
    this.routeHandlers = routeHandlers;
    this.routeHandlers.sort((a, b) => b.route.length - a.route.length);

    document.addEventListener('DOMContentLoaded', () => {
      this.router();
      if (document.getElementById('navbar') == null) {
        throw new Error('Navbar element not found');
      }
      topNavigationView.render(document.getElementById('navbar')!, '');
      if (document.getElementById('footer') == null) {
        throw new Error('Footer element not found');
      }
      document.getElementById('footer')!.innerHTML = '';
      new Footer().render(document.getElementById('footer')!);
    });

    window.addEventListener('popstate', this.router);
  }

  /**
   * Navigates to a specified URL and updates the router.
   *
   * @param url - The URL to navigate to.
   */
  public navigateTo = (url: string) => {
    history.pushState(null, '', url);
    this.router();
  };

  /**
   * Handles the routing logic based on the current path.
   * Throws an error if no route handler matches the path.
   */
  public router = () => {
    const path = window.location.pathname + window.location.search;
    // console.log('current route', this.currentRoute);
    for (const routeHandler of this.routeHandlers) {
      // console.log('checking route:', routeHandler.route);
      if (routeHandler.doesMatch(path)) {
        console.log('rendering route matched:', routeHandler.route);
        this.pathFound = routeHandler.render(path);

        if (this.pathFound) {
          break;
        }
      }
    }
    if (!this.pathFound) {
      console.log('no view handler found');
      document.getElementById('navbar')!.style.display = 'none';
      document.getElementById('sidebar')!.style.display = 'none';
      document.getElementById('content')!.innerHTML = '';
      new NotFound().render(document.getElementById('content')!);
    }

    // throw new Error('No route handler found for path: ' + path);
  };
}
