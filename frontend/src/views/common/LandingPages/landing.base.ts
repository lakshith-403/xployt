import {Quark, QuarkFunction as $} from "@ui_lib/quark";
import {View, ViewHandler} from "@ui_lib/view";
import {CACHE_STORE} from "@data/cache";
import {User, UserCache} from "@data/user";
import {HowToHacker, LandingHacker} from "@views/common/LandingPages/landing.hacker";
import {LandingHowTo} from "@views/common/LandingPages/components/LandingHowTo";

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

    // private async loadData(): Promise<void> {
    //     try {
    //         this.user = await this.userCache.get();
    //         console.log(this.user);
    //     } catch (error) {
    //         console.error('Failed to load project data:', error);
    //     }
    // }

    async render(q: Quark): Promise<void> {
        // await this.loadData();
        q.innerHTML = '';
        // if (this.type && this.type === 'Hacker') {
            $(q, 'div', 'landing', {id: 'landing-hacker'}, (q) => {
                const landingHacker = new LandingHacker();
                landingHacker.render(q);

            })
        // }
        new  LandingHowTo(this.howToContent).render(q);
    }
}

export const landingPageViewHandler = new ViewHandler('', LandingPage);