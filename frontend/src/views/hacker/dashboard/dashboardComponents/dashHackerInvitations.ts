import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { PopupTable, ContentItem } from "@components/table/popup.clickable.table";
import { Invitation } from "@data/common/cache/invitations.cache";
import {ProjectInfoCacheMock } from "@data/validator/cache/projectInfo";
import { InvitationPopup } from "@views/hacker/dashboard/hackerInvitation/InvitationPopup";
import { Popup } from "@components/popup/popup.base";

export class dashHackerInvitations {
    private readonly userId: string;
    private readonly invitations: Invitation[] = [];
    private projectInfoCache: ProjectInfoCacheMock;
    private headers: string[] = ['ID', 'Date', "Project Title", 'Start Date', 'Status'];
    private invitationsTableContent: ContentItem[] = [];
    private readonly InvitationPopup: (params: any) => Promise<HTMLElement>;

    constructor(userId: string, invitations: Invitation[]) {
        this.userId = userId
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
                const popupElement = await this.InvitationPopup({ projectInfo: projectInfo, hackerId: this.userId });
                console.log('in status:', invitation.status);
                const statusLabels: any = {
                    'Pending': {label: 'View', disable: false},
                    'Accepted': {label: 'Accepted', disable: true},
                    'Declined': {label: 'Declined', disable: true}
                };

                const {label, disable } = statusLabels[invitation.status] || { label: 'Unknown', disable: true };

                this.invitationsTableContent.push({
                    id: projectInfo.id,
                    Date: invitation.timestamp,
                    title: projectInfo.title,
                    startDate: projectInfo.startDate,
                    popup: new Popup({
                        overlayContent: popupElement,
                        label,
                        disable
                    })
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