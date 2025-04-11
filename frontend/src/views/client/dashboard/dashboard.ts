import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import './dashboard.scss'
import {CACHE_STORE} from "@data/cache";
import {dashClientSummary} from "./dashboardComponents/dashClientSummary";
import {dashClientProjectRequests} from "@views/client/dashboard/dashboardComponents/dashClientProjectRequests";
import {dashClientActiveProjects} from "@views/client/dashboard/dashboardComponents/dashClientActiveProjects";
import {ProjectBrief, ProjectsClientCache} from "@data/client/cache/projects.cache";
import LoadingScreen from "@components/loadingScreen/loadingScreen";

export class ClientDashboard extends View {
    private userId: string;
    private projectsCache: ProjectsClientCache;
    private activeProjects: ProjectBrief[] = [];
    private requestedProjects: ProjectBrief[] = [];

    constructor(params: {userId: string}) {
        super();
        this.userId = params.userId;
        this.projectsCache = CACHE_STORE.getClientProjects(this.userId);
    }

   private async loadProjectInfo(): Promise<void> {
    try {
        const projects = await this.projectsCache.load(this.userId);
        this.activeProjects = projects.activeProjects;
        this.requestedProjects = projects.requestedProjects;
        console.log(this.activeProjects);
    } catch (error) {
        console.error('Failed to load projects:', error);
    }
}



    async render(q: Quark): Promise<void> {
        const loading = new LoadingScreen(q);
        loading.show()
        await this.loadProjectInfo();
        loading.hide();
        q.innerHTML = '';
        $(q, 'div', 'client-dashboard', {}, (q) => {
            new dashClientSummary().render(q);
            new dashClientActiveProjects(this.userId, this.activeProjects).render(q);
            new dashClientProjectRequests(this.userId, this.requestedProjects).render(q);
        });

    }
}