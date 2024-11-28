import { IconButton } from '../components/button/icon.button'
import {QuarkFunction as $, Quark} from '../ui_lib/quark'
import {View, ViewHandler} from "../ui_lib/view"
// import './../assets/landing.webp';
// import './../assets/dash.png';

class HomeView extends View {

    private iconButton: IconButton
    
    constructor() {
        super();
        this.iconButton = new IconButton(
            {
                icon: 'fa-solid fa-house',
                label: 'Sign In',
                onClick: () => {
                    alert('Home button clicked')
                }
            }
        )
    }

    render(q: Quark): void {
         console.log('HomeView render')
        $(q, 'div', '', {id: "home"}, (q) => {
            $(q, 'div', 'home-section', {}, (q) => {
                $(q, 'h1', '', {}, 'Security Through Colaboration')
                $(q, 'p', '', {}, "Collaborate. Protect. Strengthen your systems.")
                this.iconButton.render(q)
            })
            $(q, 'div', 'home-section', {}, (q) => {
                $(q, 'p', '', {}, 'This is the home page')
                $(q, 'img', 'icon-image', { src: './../assets/landing.png' });
            });
        })
    }
}

export const homeViewHandler = new ViewHandler('', HomeView)