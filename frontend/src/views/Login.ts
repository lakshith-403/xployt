import {QuarkFunction as $, Quark} from '../ui_lib/quark'
import {View, ViewHandler} from "../ui_lib/view"

class LoginView implements View {
    params: {type: string}

    constructor(params: {type: string}) {
        this.params = params
    }

    render(q: Quark): void {
        $(q, 'h1', '', {}, (q) => {
            $(q, 'span', '', {}, (q) => {
              q.innerHTML = "Login " + this.params.type
            })
        })
    }
}

export const loginViewHandler = new ViewHandler('/login/{type}', LoginView)