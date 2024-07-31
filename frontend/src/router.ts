import { checkQueryParamExists, getQueryParamValue, parseQueryParams, updateQueryParams } from './queryParamHandler';
import { parsePathParams, updatePathParams } from './pathParamHandler';

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
        const queryString = window.location.search;
        
        const queryParams = parseQueryParams(queryString);
        updateQueryParams(queryParams);
        const pathParams = parsePathParams(path);
        updatePathParams(pathParams);
        
        // const route = this.routes[path] || (() => `<h1>404 Not Found</h1>`)
        const route = this.routes[path] || (() => this.displayObject(pathParams, queryParams))
        
        // console.log(queryParams)
        // console.log(path)
        // console.log(pathParams)
        // console.log(getQueryParamValue('name'))
        // console.log(checkQueryParamExists('name'))
        
        document.getElementById('root').innerHTML = route()

    };
    private displayObject = (pathParams: Record<string, string>, queryParams: Record<string, string>) => {
        return ( 
        `<pre>${JSON.stringify(pathParams, null, 2)}\n${JSON.stringify(queryParams, null, 2)}</pre>`
        )
    }
}

const router = new Router()