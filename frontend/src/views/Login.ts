import {QuarkFunction as $, Quark} from '../ui_lib/quark'
import {View, ViewHandler} from "../ui_lib/view"
import {UserCache} from "../data/user";
import {CACHE_STORE} from "../data/cache";

class LoginView implements View {
    params: {user_id: string}
    userCache: UserCache

    constructor(params: {user_id: string}) {
        this.params = params

        this.userCache = CACHE_STORE.getUser(params.user_id)
    }

    render(q: Quark): void {
        $(q, 'h1', '', {}, (q) => {
            $(q, 'span', '', {}, (q) => {
              q.innerHTML = "Login " + this.params.user_id
            })
        })
    }
}

export const loginViewHandler = new ViewHandler('/login/{type}', LoginView)