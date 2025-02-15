import { ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import './dashboard.scss'
import {Invitation, InvitationsCache} from "@data/common/cache/invitations.cache";
import {CACHE_STORE} from "@data/cache";
import {dashClientSummary} from "./dashboardComponents/dashClientSummary";
import {dashClientProjects} from "@views/client/dashboard/dashboardComponents/dashClientProjects";

export class ClientDashboard extends View {
    private params: {userId: string};
    private invitations: Invitation[] = [];
    private readonly invitationCache: InvitationsCache;

    constructor(params: {userId: string}) {
        super();
        this.params = params;
        this.invitationCache = CACHE_STORE.getHackerInvitations(this.params.userId);
    }

    private async loadInvitations(): Promise<void>{
        try{
            this.invitations = await this.invitationCache.get(false, this.params.userId) as Invitation[];
        }catch (error) {
            console.error('Failed to load invitations:', error);
        }
    }

    async render(q: Quark): Promise<void> {
        await this.loadInvitations();
        q.innerHTML = '';
        $(q, 'div', 'hacker-dashboard', {}, (q) => {
            new dashClientSummary().render(q);
            new dashClientProjects(this.params.userId).render(q);
        });

    }
}