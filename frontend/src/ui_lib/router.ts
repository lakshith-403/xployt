import {Quark as $} from "./quark" 
import { RouteHandler } from "./route"

export interface NavigationView {
    baseURL: string
    willUpdate: () => void
    render: ($: $) => void
}

export class Router {
    private readonly routeHandlers: RouteHandler[]

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

    public navigateTo = (url: string) => {
        history.pushState(null, "", url)
        this.router()
    }

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