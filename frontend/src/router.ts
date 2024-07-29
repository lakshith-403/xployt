class Router {
    private routes: Record<string, any> = {
        '/': () => `<h1>Home Page</h1>`,
        '/about': () => `<h1>About Page</h1>`,
        '/contact': () => `<h1>Contact Page</h1>`,
    }

    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            this.router()
        })

        window.addEventListener('popstate', this.router);
    }

    public navigateTo = (url: string) => {
        history.pushState(null, null, url)
        this.router()
    }

    public router = () => {
        const path = window.location.pathname
        const route = this.routes[path] || (() => `<h1>404 Not Found</h1>`)
        document.getElementById('root').innerHTML = route()
    };
}

const router = new Router()