import {Quark, QuarkFunction as $} from "@ui_lib/quark";
import {View, ViewHandler} from "@ui_lib/view";
import {LandingHowTo} from "@views/common/LandingPages/components/LandingHowTo";
import {Button, ButtonType} from "@components/button/base";
import {LandingTestimonials} from "@views/common/LandingPages/components/LandingTestimonials";
import {router} from "@ui_lib/router";

class LandingPageValidator extends View {

    constructor() {
        super();
    }

    private howToContent = ['Sign up and create your profile.',
        'Add your interests and expertise',
        'Get recruited to security projects niche to your profile.',
        'Analyze vulnerability reports for accuracy and completeness.',
        ' Gain credibility and contribute to a safer digital world.']

    private testimonials = [
        {
            message: 'Validating reports on this platform helped me refine my cybersecurity skills while contributing to real-world security.',
            userId: '107',
            user: {
                name: 'Fiona Williams',
                profilePicture: 'https://randomuser.me/api/portraits/women/90.jpg'
            }
        },
        {
            message: 'I went from a beginner to getting my first paid vulnerability report in just months!',
            userId: '107',
            user: {
                name: 'Hannah Johnson',
                profilePicture: 'https://randomuser.me/api/portraits/women/40.jpg'
            }
        }
    ]

    render(q: Quark): void {
        q.innerHTML = '';
        $(q, 'div', 'landing', {id: 'landing-hacker'}, (q) => {
            $(q, 'div', 'landing-comp', {}, (q) => {
                $(q, 'h1', 'title', {}, 'Validate. Secure. Strengthen.');
                $(q, 'ul', '', {}, (q) => {
                    $(q, 'li', '', {}, 'Join our platform as a security validator and play a crucial role in ensuring the accuracy and reliability of vulnerability reports.');
                });
                $(q, 'a', 'learn-more', {href: '#how-to'}, 'Learn more');
                new Button({
                    type: ButtonType.SECONDARY,
                    label: "Apply",
                    onClick: () => {
                        router.navigateTo('/validator/application');
                    }
                }).render(q)
            });
        })
        new LandingHowTo(this.howToContent).render(q);
        new LandingTestimonials(this.testimonials).render(q);
    }
}

export const validatorLandingPageViewHandler = new ViewHandler('', LandingPageValidator);