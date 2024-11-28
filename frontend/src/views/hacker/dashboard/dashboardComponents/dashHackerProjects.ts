import {QuarkFunction as $, Quark} from '@ui_lib/quark';
import {Project, ProjectsCacheMock} from "@data/validator/cache/projects.cache";
import {ProjectInfo, ProjectInfoCacheMock} from "@data/validator/cache/projectInfo";
import {CACHE_STORE} from "@data/cache";
import {ClickableTable, ContentItem} from "@components/table/clickable.table";

export class dashHackerProjects {
    private readonly userId: number;
    private projects: Project[] = [];
    private ProjectsCache: ProjectsCacheMock;
    private projectInfoCache: ProjectInfoCacheMock;
    private tableContent: ContentItem[] = [];

    constructor(userId: number) {
        this.userId = userId;
        this.ProjectsCache = CACHE_STORE.getProjects();
        this.projectInfoCache = new ProjectInfoCacheMock();
    }

    private async loadProjects(): Promise<void> {
    }

    render(q: Quark): void {
        $(q, 'h1', "", {}, 'Projects');
    }
}