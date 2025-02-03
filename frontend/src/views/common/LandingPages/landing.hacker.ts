import {Quark, QuarkFunction as $} from "@ui_lib/quark";
import {View, ViewHandler} from "@ui_lib/view";
import {LandingHowTo} from "@views/common/LandingPages/components/LandingHowTo";
import {Button, ButtonType} from "@components/button/base";
import {LandingTestimonials} from "@views/common/LandingPages/components/LandingTestimonials";
import {router} from "@ui_lib/router";

class LandingPage extends View {
    // private userCache: UserCache;
    private type: string;

    constructor(type: string = 'Hacker') {
        super();
        this.type = type;
    }

    private howToContent = ['Sign up and create your profile.',
        'Add your interests and expertise',
        'Get invited to security projects niche to your profile.',
        'Submit reports and collaborate with teams.',
        'Earn rewards, gain recognition, and level up.']

    private testimonials = [
        {
            message: 'Xployt helped me sharpen my skills and land my first bug bounty reward!',
            userId: '107',
            user: {
                name: 'George Clark',
                profilePicture: 'https://randomuser.me/api/portraits/men/9.jpg'
            }
        },
        {
            message: 'I went from a beginner to getting my first paid vulnerability report in just months!',
            userId: '107',
            user: {
                name: 'Emma Johnson',
                profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg'
            }
        },
        {
            message: 'I love the community and the recognition I get for my work on Xployt!',
            userId: '110',
            user: {
                name: 'Ian Martinez',
                profilePicture: 'https://randomuser.me/api/portraits/men/90.jpg'
            }
        }
    ]

    render(q: Quark): void {
        q.innerHTML = '';
        $(q, 'div', 'landing', {id: 'landing-hacker'}, (q) => {
            $(q, 'div', 'landing-comp', {}, (q) => {
                $(q, 'h1', 'title', {}, 'Hack, Earn.');
                $(q, 'ul', '', {}, (q) => {
                    $(q, 'li', '', {}, 'Join a global network of ethical hackers and security researchers.');
                    $(q, 'li', '', {}, 'Earn Blast Points by identifying vulnerabilities, collaborating on security projects, and proving your skills.');
                });
                $(q, 'a', 'learn-more', {href: '#how-to'}, 'Learn more');
                new Button({
                    type: ButtonType.SECONDARY,
                    label: "Sign Up",
                    onClick: () => {
                        router.navigateTo('/login');
                    }
                }).render(q)
            });
        })
        new LandingHowTo(this.howToContent).render(q);
        new LandingTestimonials(this.testimonials).render(q);
    }
}

export const landingPageViewHandler = new ViewHandler('', LandingPage);