import {QuarkFunction as $, Quark} from '../ui_lib/quark'
import {View, ViewHandler} from "../ui_lib/view"

class HomeView implements View {
    constructor() {
    }

    render(q: Quark): void {
         console.log('HomeView render')
        $(q, 'h1', '', {}, (q) => {
            $(q, 'span', '', {}, (q) => {
              q.innerHTML = "Home"
            })
        })
    }
}

export const homeViewHandler = new ViewHandler('', HomeView)