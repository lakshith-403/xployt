import {QuarkFunction as $, Quark} from '@ui_lib/quark';
import {ClickableTable, ContentItem} from "@components/table/clickable.table";
import {Invitation} from "@data/common/cache/invitations.cache";
import {ProjectInfo, ProjectInfoCacheMock} from "@data/validator/cache/projectInfo";

export class dashClientProjects {
    private projectInfoCache: ProjectInfoCacheMock;
    private headers: string[] = ["Project Title", "Status", 'Start Date']
    private invitationsTableContent: ContentItem[] = [];

    constructor() {
        this.projectInfoCache = new ProjectInfoCacheMock();
    }

    private async loadProjectInfo(): Promise<void> {

        try {
            const projectInfo = await this.projectInfoCache.get(false, 1);
            console.log(`Project Info for ${1}:`, projectInfo);
            this.invitationsTableContent.push({
                id: projectInfo.id,
                // Date: invitation.timestamp,
                title: projectInfo.title,
                status: "Pending",
                startDate: projectInfo.startDate
            })
        } catch (error) {
            console.error(`Failed to load project info for ${1}:`, error);
        }

    }


    async render(q: Quark): Promise<void> {
        await this.loadProjectInfo();
        $(q, 'div', 'invitations', {}, (q) => {
            $(q, 'h2', '', {}, 'Project Requests');
            new ClickableTable(this.invitationsTableContent, this.headers).render(q);
        });

    }

}
