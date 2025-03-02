import {QuarkFunction as $} from '@ui_lib/quark';
import BasicInfoComponent from "@components/basicInfo/basicInfoComponent";
import './InvitationPopup.scss'
import {IconButton} from "@components/button/icon.button";
import {ButtonType} from "@components/button/base";
import {Project} from "@data/common/cache/project.cache";
import {HackerInvitationsCache} from "@data/hacker/cache/hacker.invitations.cache";

export class InvitationPopup {
    private projectInfo: Project;
    private hackerId: string;
    private invitationsCache: HackerInvitationsCache;

    constructor(params: { projectInfo: Project, hackerId: string }) {
        this.projectInfo = params.projectInfo;
        this.hackerId = params.hackerId;
        this.invitationsCache = new HackerInvitationsCache(this.hackerId);
    }

    private async acceptInvitation(): Promise<void> {
        try{
            await this.invitationsCache.accept(this.projectInfo.projectId.toString(), this.hackerId, true);
        }
        catch (error) {
            console.error('Failed to accept invitation:', error);

        }
    }

    private async rejectInvitation(): Promise<void> {
        try{
            await this.invitationsCache.accept(this.projectInfo.projectId.toString(), this.hackerId, false);
        }
        catch (error) {
            console.error('Failed to reject invitation:', error);
        }
    }


    async render(): Promise<HTMLElement> {
        const q = document.createElement('div');
        console.log('Project Info: Invitation Popup ', this.projectInfo);

        $(q, 'div', 'hacker-invitation', {}, (q) => {
            $(q, 'h2', '', {}, `Invitation: ${this.projectInfo.title} #${convertToTitleCase(this.projectInfo.projectId.toString())}`);
            $(q, 'div', 'content', {}, (q) => {
                $(q, 'div', '', {id: 'basic-info'}, (q) => {
                    new BasicInfoComponent(this.projectInfo).render(q);
                });

                $(q, 'h3', '', {}, 'Rules and Scope');
                $(q, 'ul', '', {}, (q) => {
                    this.projectInfo.scope.forEach((rule) => {
                        $(q, 'li', '', {}, rule);
                    });
                });
                $(q, 'div', 'buttons', {}, (q) => {
                    new IconButton({
                        type: ButtonType.PRIMARY,
                        icon: 'fa-solid fa-check',
                        label: 'Accept Invitation',
                        onClick: () => {
                            this.acceptInvitation();
                        }
                    }).render(q);
                    new IconButton({
                        type: ButtonType.TERTIARY,
                        icon: 'fa-solid fa-times',
                        label: 'Reject Invitation',
                        onClick: () => {
                            this.rejectInvitation();
                        }
                    }).render(q);
                });
            });

        })

        return q;
    }
}

function convertToTitleCase(input: string): string {
    const words = input.replace(/([A-Z])/g, ' $1').trim();
    return words.replace(/\w\S*/g, (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
}