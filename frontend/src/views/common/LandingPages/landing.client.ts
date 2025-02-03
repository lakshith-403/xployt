import {Quark, QuarkFunction as $} from "@ui_lib/quark";
import {View, ViewHandler} from "@ui_lib/view";
import {LandingHowTo} from "@views/common/LandingPages/components/LandingHowTo";
import {Button, ButtonType} from "@components/button/base";
import {LandingTestimonials} from "@views/common/LandingPages/components/LandingTestimonials";
import {router} from "@ui_lib/router";

class LandingPageClient extends View {

    constructor() {
        super();
    }

    private howToContent = ['Sign up and create your organization profile.',
        'Submit a project and define your security requirements',
        'Discuss a quotation to match your needs',
        'Choose from a pool of security professionals.',
        'Get defined vulnerability reports.',]

    private testimonials = [
        {
            message: 'We identified critical security flaws in our system before they became a problem. Highly recommend this platform!',
            userId: '101',
            user: {
                name: 'Bob Jones | CTO - FinTech Solutions',
                profilePicture: 'https://randomuser.me/api/portraits/men/34.jpg'
            }
        },
        {
            message: 'A seamless experience from start to finish. The reports were incredibly detailed and easy to follow',
            userId: '107',
            user: {
                name: 'Alice Smith | Head of IT - Uniliver',
                profilePicture: 'https://randomuser.me/api/portraits/women/26.jpg'
            }
        }
    ]

    render(q: Quark): void {
        q.innerHTML = '';
        $(q, 'div', 'landing', {id: 'landing-client'}, (q) => {
            $(q, 'div', 'landing-comp', {}, (q) => {
                $(q, 'h1', 'title', {}, 'Protect what matters most.');
                $(q, 'p', '', {}, 'Connect with top security experts to identify and fix vulnerabilities before attackers do.');
                $(q, 'p', 'why-join', {}, 'Why join us?')
                $(q, 'div', 'why-join-content', {}, (q) => {
                   $(q, 'span', '', {}, (q) => {
                          $(q, 'i', 'fas fa-shield-alt', {}, '');
                          $(q, 'p', '', {}, 'Verified ethical hackers with proven track records.');
                   });
                   $(q, 'span', '', {}, (q) => {
                          $(q, 'i', 'fas fa-shield-alt', {}, '');
                          $(q, 'p', '', {}, 'Identify and fix vulnerabilities before they become threats.');
                   });
                   $(q, 'span', '', {}, (q) => {
                          $(q, 'i', 'fas fa-shield-alt', {}, '');
                          $(q, 'p', '', {}, 'Tailored security audits for your business needs.');
                   });
                   $(q, 'span', '', {}, (q) => {
                          $(q, 'i', 'fas fa-shield-alt', {}, '');
                          $(q, 'p', '', {}, 'Detailed insights and actionable recommendations.');
                   })
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

export const clientLandingPageViewHandler = new ViewHandler('', LandingPageClient);