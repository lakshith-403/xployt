import {QuarkFunction as $, Quark} from '@ui_lib/quark';
import {ClickableTable, ContentItem} from "@components/table/clickable.table";
import {Invitation} from "@data/common/cache/invitations.cache";
import {ProjectInfo, ProjectInfoCacheMock} from "@data/validator/cache/projectInfo";

export class dashHackerInvitations {
    private invitations: Invitation[] = [];
    private projectInfoCache: ProjectInfoCacheMock;
    private headers: string[] = ['Date', "Project Title", 'Start Date']
    private invitationsTableContent: ContentItem[] = [];

    constructor(invitations: Invitation[]) {
        this.invitations = invitations;
        this.projectInfoCache = new ProjectInfoCacheMock();
    }

    private async loadProjectInfo(): Promise<void> {
        for (const invitation of this.invitations) {
            try {
                const projectInfo = await this.projectInfoCache.get(false, invitation.projectId);
                console.log(`Project Info for ${invitation.projectId}:`, projectInfo);
                this.invitationsTableContent.push({
                    id: projectInfo.id,
                    Date: invitation.timestamp,
                    title: projectInfo.title,
                    startDate: projectInfo.startDate

                })
            } catch (error) {
                console.error(`Failed to load project info for ${invitation.projectId}:`, error);
            }
        }
    }

    async render(q: Quark): Promise<void> {
        await this.loadProjectInfo();
        $(q, 'div', 'invitations', {}, (q) => {
            $(q, 'h2', '', {}, 'Invitations');
            new ClickableTable(this.invitationsTableContent, this.headers).render(q);
        })

    }
}
