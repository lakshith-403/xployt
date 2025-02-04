import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { PopupTable, ContentItem } from "@components/table/popup.clickable.table";
import { ClickableTable } from "@components/table/clickable.table";
import { Invitation } from "@data/common/cache/invitations.cache";
import { ProjectInfo, ProjectInfoCacheMock } from "@data/validator/cache/projectInfo";
import { InvitationPopup } from "@views/hacker/dashboard/hackerInvitation/InvitationPopup";
import { Popup } from "@components/popup/popup.base";

export class dashHackerInvitations {
    private invitations: Invitation[] = [];
    private projectInfoCache: ProjectInfoCacheMock;
    private headers: string[] = ['Date', "Project Title", 'Start Date'];
    private invitationsTableContent: ContentItem[] = [];
    private InvitationPopup: (params: any) => Promise<HTMLElement>;

    constructor(invitations: Invitation[]) {
        this.invitations = invitations;
        this.projectInfoCache = new ProjectInfoCacheMock();
        this.InvitationPopup = async (params: any) => {
            const popup = new InvitationPopup(params);
            return await popup.render();
        };
    }

    private async loadProjectInfo(): Promise<void> {
        for (const invitation of this.invitations) {
            try {
                const projectInfo = await this.projectInfoCache.get(false, invitation.projectId);
                console.log(`Project Info for ${invitation.projectId}:`, projectInfo);
                const popupElement = await this.InvitationPopup({ projectId: projectInfo.id.toString() });
                this.invitationsTableContent.push({
                    id: projectInfo.id,
                    Date: invitation.timestamp,
                    title: projectInfo.title,
                    startDate: projectInfo.startDate,
                    popup: new Popup(popupElement)
                });
            } catch (error) {
                console.error(`Failed to load project info for ${invitation.projectId}:`, error);
            }
        }
    }

    async render(q: Quark): Promise<void> {
        $(q, 'div', 'invitations', {}, async (q) => {
            $(q, 'h2', '', {}, 'Invitations');
            await this.loadProjectInfo();
            new PopupTable(this.invitationsTableContent, this.headers).render(q);
        });
    }
}