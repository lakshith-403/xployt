import {Quark, QuarkFunction as $} from "@ui_lib/quark";
import '../landing.scss'
import {CACHE_STORE} from "@data/cache";
import {UserProfileCache} from "@data/user/cache/userProfile";

export interface Testimonial {
    message: string;
    userId: string;
    // user?: UserProfile;
    user?: any;
}

export class LandingTestimonials {
    private testimonials: Testimonial[];

    constructor(testimonials: Testimonial[]) {
        this.testimonials = testimonials;
    }

    private async loadData(): Promise<void> {
        console.log('loading data for testimonials');
        try {
            for (const testimonial of this.testimonials) {
                const userCache = CACHE_STORE.getUserProfile(testimonial.userId) as UserProfileCache;
                testimonial.user = await userCache.get(false, testimonial.userId);
                console.log('testimonials', testimonial.user)
            }
        } catch (error) {
            console.error('Failed to load project data:', error);
        }
    }

    async render(q: Quark): Promise<void> {
        $(q, 'div', '', {id: 'testimonials'}, async (q) => {
            $(q, 'h1', 'title', {}, 'Testimonials');
            // await this.loadData();
            $(q, 'div', 'testimonials-content', {}, (q) => {
                for (const testimonial of this.testimonials) {
                    $(q, 'div', 'testimonial', {}, (q) => {
                        $(q, 'img', 'quote', {src: '../../../assets/quote.png'});
                        $(q, 'p', 'message', {}, testimonial.message);
                        $(q, 'div', 'user', {}, (q) => {
                            $(q, 'img', 'avatar', {src: testimonial.user?.profilePicture});
                            $(q, 'p', 'name', {}, testimonial.user?.name);
                            console.log(testimonial.user);
                        });
                    });
                }
            });
        });
    }
}