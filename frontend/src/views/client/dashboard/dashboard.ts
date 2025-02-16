import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import './dashboard.scss'
import {CACHE_STORE} from "@data/cache";
import {dashClientSummary} from "./dashboardComponents/dashClientSummary";
import {dashClientProjectRequests} from "@views/client/dashboard/dashboardComponents/dashClientProjectRequests";
import {dashClientActiveProjects} from "@views/client/dashboard/dashboardComponents/dashClientActiveProjects";
import {Project, ProjectsClientCache} from "@data/client/cache/projects.cache";

export class ClientDashboard extends View {
    private userId: string;
    private projectsCache: ProjectsClientCache;
    private activeProjects: Project[] = [];
    private requestedProjects: Project[] = [];

    constructor(params: {userId: string}) {
        super();
        this.userId = params.userId;
        this.projectsCache = CACHE_STORE.getClientProjects(this.userId);
    }

   private async loadProjectInfo(): Promise<void> {
    try {
        const projects = await this.projectsCache.load(this.userId);
        this.activeProjects = projects[0];
        this.requestedProjects = projects[1];
        console.log(this.activeProjects);
    } catch (error) {
        console.error('Failed to load projects:', error);
    }
}



    async render(q: Quark): Promise<void> {
        await this.loadProjectInfo()
        q.innerHTML = '';
        $(q, 'div', 'client-dashboard', {}, (q) => {
            new dashClientSummary().render(q);
            new dashClientActiveProjects(this.userId, this.activeProjects).render(q);
            new dashClientProjectRequests(this.userId, this.requestedProjects).render(q);
        });

    }
}