import { RouteHandler } from "./route"
import { NavigationView } from "./view";


/**
 * Represents a Router that manages navigation and route handling.
 */
export class Router {
    private readonly routeHandlers: RouteHandler[]

    /**
     * Creates an instance of the Router.
     * 
     * @param routeHandlers - An array of route handlers to manage navigation.
     * @param topNavigationView - The navigation view to render in the navbar.
     */
    constructor(routeHandlers: RouteHandler[] = [], topNavigationView: NavigationView) {
        this.routeHandlers = routeHandlers
        this.routeHandlers.sort((a, b) => b.route.length - a.route.length);

        document.addEventListener('DOMContentLoaded', () => {
            this.router()
            if (document.getElementById('navbar') == null) {
                throw new Error('Navbar element not found')
            }
            topNavigationView.render(document.getElementById('navbar')!)
        })

        window.addEventListener('popstate', this.router);
    }

    /**
     * Navigates to a specified URL and updates the router.
     * 
     * @param url - The URL to navigate to.
     */
    public navigateTo = (url: string) => {
        history.pushState(null, "", url)
        this.router()
    }

    /**
     * Handles the routing logic based on the current path.
     * Throws an error if no route handler matches the path.
     */
    public router = () => {
        const path = window.location.pathname + window.location.search

        for (const routeHandler of this.routeHandlers) {
            if (routeHandler.doesMatch(path)) {
                routeHandler.render(path)
                return
            }
        }

        throw new Error('No route handler found for path: ' + path)
    }
}