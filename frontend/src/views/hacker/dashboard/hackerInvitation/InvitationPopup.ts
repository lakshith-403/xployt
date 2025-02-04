import {QuarkFunction as $} from '@ui_lib/quark';
import {CACHE_STORE} from '@data/cache';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import BasicInfoComponent from "@components/basicInfo/basicInfoComponent";
import {ProjectInfo, ProjectInfoCacheMock} from "@data/validator/cache/projectInfo";
import './InvitationPopup.scss'
import {IconButton} from "@components/button/icon.button";
import {ButtonType} from "@components/button/base";

export class InvitationPopup {
    private readonly projectId: string;
    private projectInfo: ProjectInfo = {} as ProjectInfo;

    constructor(params: { projectId: string }) {
        this.projectId = params.projectId;
    }


    async loadData(): Promise<void> {
        try {
            const projectInfoCache = CACHE_STORE.getProjectInfo(this.projectId) as ProjectInfoCacheMock;
            this.projectInfo = await projectInfoCache.get(false, this.projectId);
        } catch (error) {
            console.error('Failed to load project data', error);
        }
    }

    async render(): Promise<HTMLElement> {
        const q = document.createElement('div');
        const loading = new LoadingScreen(q);
        loading.show();

        await this.loadData();
        loading.hide();

        $(q, 'div', 'hacker-invitation', {}, (q) => {
            $(q, 'h2', '', {}, `Invitation: ${this.projectInfo.title} #${convertToTitleCase(this.projectId)}`);
            $(q, 'div', 'content', {}, (q) => {
                $(q, 'div', '', {id: 'basic-info'}, (q) => {
                    new BasicInfoComponent(this.projectId, this.projectInfo.client).render(q);
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
                            console.log('Accept Invitation');
                        }
                    }).render(q);
                    new IconButton({
                        type: ButtonType.TERTIARY,
                        icon: 'fa-solid fa-times',
                        label: 'Reject Invitation',
                        onClick: () => {
                            console.log('Reject Invitation');
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