import { NavigationView } from "./router"
import { extractQueryParams, matchUrl, matchUrlWithBase } from "./utils"
import { ViewHandler } from "./view"

export class RouteHandler {
    route: string
    viewHandlers: ViewHandler[]
    navigationView: NavigationView

    constructor(route: string, viewHandlers: ViewHandler[], navigationView: NavigationView) {
      this.route = route
      this.viewHandlers = viewHandlers
      this.navigationView = navigationView
    }

    public doesMatch(url: string): boolean {
      return matchUrlWithBase(url, this.route)
    }

    public render(url: string): void {
      this.navigationView.render(document.getElementById('sidebar')!)

      for (const viewHandler of this.viewHandlers) {
        if (matchUrl(url, this.route + viewHandler.route)) {
          viewHandler.setView(extractQueryParams(url))
          return
        }
      }

      throw new Error('No view handler found for route: ' + url)
    }
}