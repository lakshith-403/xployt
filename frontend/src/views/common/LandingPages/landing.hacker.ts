import {Quark, QuarkFunction as $} from "@ui_lib/quark";
import './landing.scss'
import {Button, ButtonType} from "@components/button/base";

export class LandingHacker {
    // private currentUser: User;
    constructor() {
    }

    render(q: Quark): void {
        q.innerHTML = '';
        $(q, 'div', 'landing-comp', {}, (q) => {
            $(q, 'h1', '', {}, 'Hack, Earn.');
            $(q, 'ul', '', {}, (q) => {
                $(q, 'li', '', {}, 'Join a global network of ethical hackers and security researchers.');
                $(q, 'li', '', {}, 'Earn Blast Points by identifying vulnerabilities, collaborating on security projects, and proving your skills.');
            });
            $(q, 'a', 'learn-more', {href: '#how-to'}, 'Learn more');
            new Button({
                type: ButtonType.SECONDARY,
                label: "Sign Up",
                onClick: () => {
                    window.location.href = '/login';
                }
            }).render(q)
        });
        // $(q, 'div', 'landing-comp', {}, (q) => {
        //
        // })
    }
}

export class HowToHacker {
    constructor() {
    }

    render(q: Quark): void {
        // q.innerHTML = '';
        $(q, 'div', 'how-to-hacker', {}, (q) => {
            q.innerHTML = "sth"
        })
    }
}