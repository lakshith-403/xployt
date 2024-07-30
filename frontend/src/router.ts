import { checkQueryParamExists, getQueryParamValue, updateQueryParams } from './globals';

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
        // const route = this.routes[path] || (() => `<h1>404 Not Found</h1>`)
        /////
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        const params: Record<string, string> = {};
        urlParams.forEach((value, key) => {
            params[key] = value;
        });

        updateQueryParams(params);
        const route = this.routes[path] || (() => this.displayObject(params))
        console.log(getQueryParamValue('name'))
        console.log(checkQueryParamExists('name'))
        /////
        
        document.getElementById('root').innerHTML = route()

    };
    /////
    private displayObject = (params: Record<string, string>) => {
        return `<pre>${JSON.stringify(params, null, 2)}</pre>`;
    }
    /////
}

const router = new Router()