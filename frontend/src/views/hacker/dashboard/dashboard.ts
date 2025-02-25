import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import './dashboard.scss'
import {Invitation, InvitationsCache} from "@data/common/cache/invitations.cache";
import {CACHE_STORE} from "@data/cache";
import {dashHackerSummary} from "./dashboardComponents/dashHackerSummary";
import {dashHackerInvitations} from "@views/hacker/dashboard/dashboardComponents/dashHackerInvitations";
import {ProjectBrief, UserProjectsCache} from "@data/common/cache/projects.cache";
import LoadingScreen from "@components/loadingScreen/loadingScreen";
import {dashHackerProjects} from "@views/hacker/dashboard/dashboardComponents/dashHackerProjects";

export class HackerDashboard extends View {
    private userId: string
    private invitations: Invitation[] = [];
    private projects: ProjectBrief[] = [];
    private readonly invitationCache: InvitationsCache;
    private projectsCache = new UserProjectsCache();

    constructor(params: {userId: string}) {
        super();
        this.userId = params.userId
        this.invitationCache = CACHE_STORE.getHackerInvitations(this.userId);
    }

    private async loadInvitations(): Promise<void>{
        try{
            this.invitations = await this.invitationCache.get(false, this.userId) as Invitation[];

        }catch (error) {
            console.error('Failed to load invitations:', error);
        }
    }

    private async loadProjects(): Promise<void> {
        try{
            const allProjects = await this.projectsCache.get(true, this.userId, 'hacker');
            this.projects = allProjects.activeProjects;
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    }

    async render(q: Quark): Promise<void> {
        const loading = new LoadingScreen(q)
        loading.show()
        await this.loadInvitations();
        await this.loadProjects();
        loading.hide()
        q.innerHTML = ''
        $(q, 'div', 'hacker-dashboard', {}, (q) => {
            new dashHackerSummary().render(q);
            new dashHackerInvitations(this.userId, this.invitations).render(q);
            new dashHackerProjects(this.userId, this.projects).render(q)
        });

    }
}