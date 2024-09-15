import { IconButton } from '../components/button/icon.button'
import {QuarkFunction as $, Quark} from '../ui_lib/quark'
import {View, ViewHandler} from "../ui_lib/view"

class HomeView extends View {

    private iconButton: IconButton
    
    constructor() {
        super();
        this.iconButton = new IconButton(
            {
                icon: 'fa-solid fa-house',
                label: 'Home',
                onClick: () => {
                    alert('Home button clicked')
                }
            }
        )
    }

    render(q: Quark): void {
         console.log('HomeView render')
        $(q, 'h1', '', {}, (q) => {
            this.iconButton.render(q)
        })
    }
}

export const homeViewHandler = new ViewHandler('', HomeView)