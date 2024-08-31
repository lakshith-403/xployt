import './styles/styles.scss'
import { Quark, QuarkFunction as $ } from './ui_lib/quark'
import { RouteHandler } from './ui_lib/route'
import './ui_lib/router'
import {Router} from "./ui_lib/router"
import { NavigationView } from './ui_lib/view'
import {homeViewHandler} from "./views/home"
import {loginViewHandler} from "./views/Login"

class HomeSidebarView implements NavigationView {
    baseURL: string = ''

    willUpdate: () => void = () => {
    }

    render(q: Quark): void {
        q.innerHTML = ''
        $(q, 'ul', '', {}, (q) => {
            $(q, 'li', '', {}, (q) => {
            $(q, 'a', '', {href: this.baseURL + '/'}, "Home")
            })
        })
    }
}

class AboutSidebarView implements NavigationView {
    baseURL: string = '/about'

    willUpdate: () => void = () => {
    }

    render(q: Quark): void {
        q.innerHTML = ''
        $(q, 'ul', '', {}, (q) => {
            $(q, 'li', '', {}, (q) => {
                $(q, 'a', '', {href: this.baseURL + '/login/user'}, "Login")
            })
        })
    }
}

class TopNavigationView implements NavigationView {
    baseURL: string = ''

    willUpdate: () => void = () => {
    }

    render(q: Quark): void {
        q.innerHTML = ''
        $(q, 'ul', '', {}, (q) => {
            $(q, 'li', '', {}, (q) => {
                $(q, 'a', '', {href: '/'}, "Home") 
                $(q, 'a', '', {href: '/about'}, "About")
            })
        })
    }
}

const HomeRouteHandler = new RouteHandler('/', [homeViewHandler], new HomeSidebarView())
const AboutRouteHandler = new RouteHandler('/about', [homeViewHandler, loginViewHandler], new AboutSidebarView())
const LoginRouteHandler = new RouteHandler('/login', [loginViewHandler], undefined, true)

const router = new Router([
    HomeRouteHandler,
    AboutRouteHandler,
    LoginRouteHandler
], new TopNavigationView())