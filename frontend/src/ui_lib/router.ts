import {ViewHandler} from "./view"

export class Router {
    private readonly viewHandlers: ViewHandler[]

    constructor(viewHandlers: ViewHandler[] = []) {
        this.viewHandlers = viewHandlers

        document.addEventListener('DOMContentLoaded', () => {
            this.router()
        })

        window.addEventListener('popstate', this.router);
    }

    public navigateTo = (url: string) => {
        history.pushState(null, "", url)
        this.router()
    }

    public router = () => {
        const path = window.location.pathname + window.location.search

        for (const viewHandler of this.viewHandlers) {
            const match = this.matchUrl(path, viewHandler.route)
            console.log(viewHandler.route, match)
            if (match.matched) {
                viewHandler.setView(match.params)
                return
            }
        }

    };

    private matchUrl(url: string, pattern: string): { matched: boolean, params?: Record<string, string> } {
        const [path, queryString] = url.split('?')
        const queryParams = this.extractQueryParams(queryString || '')

        const regex = new RegExp('^' + pattern.replace(/{\w+}/g, '([^/]+)') + '$')
        const match = path.match(regex)

        if (match) {
            const paramNames = (pattern.match(/{\w+}/g) || []).map(param => param.slice(1, -1))
            const params: Record<string, string> = {}

            paramNames.forEach((name, index) => {
                params[name] = match[index + 1]
            })

            return { matched: true, params: { ...params, ...queryParams } }
        }

        return {matched: false, params: {}}
    }

    private extractQueryParams(queryString: string): Record<string, string> {
        const queryParams: Record<string, string> = {}
        if (!queryString) {
            return queryParams
        }

        const pairs = queryString.split('&')
        for (const pair of pairs) {
            const [key, value] = pair.split('=')
            queryParams[decodeURIComponent(key)] = decodeURIComponent(value || '')
        }

        return queryParams
    }
}