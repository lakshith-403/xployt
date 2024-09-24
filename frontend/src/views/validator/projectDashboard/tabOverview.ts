import {Quark, QuarkFunction as $} from '../../../ui_lib/quark';
import {CACHE_STORE} from '../../../data/cache';
import {router} from "@ui_lib/router";
import {ProjectInfoCacheMock, ProjectInfo} from '../../../data/validator/cache/projectInfo';
import {ProjectTeamCacheMock, ProjectTeam} from '@data/validator/cache/project.team';
import LoadingScreen from '../../../components/loadingScreen/loadingScreen';
import {Card} from "@components/card/card.base";
import {IconButton} from "@components/button/icon.button";
import {OverviewPayments} from "@views/validator/projectDashboard/tabOverview/payments";
import {OverviewReports} from "@views/validator/projectDashboard/tabOverview/reports";
import {OverviewBasicInfo} from "@views/validator/projectDashboard/tabOverview/basicInfo";
import './tabOverview.scss'

export default class Overview {
    projectInfo: ProjectInfo = {} as ProjectInfo
    projectTeam: {
        [key: string]: {
            name: string;
            id: number;
            username: string;
            email: string;
        }
    } = {
        projectLead: {
            name: '',
            id: 0,
            username: '',
            email: ''
        },
        assignedValidator: {
            name: '',
            id: 0,
            username: '',
            email: ''
        }
    }

    constructor(private readonly projectId: string) {
        this.projectId = projectId;
    }

    private readonly projectInfoCache = CACHE_STORE.getProjectInfo(this.projectId) as ProjectInfoCacheMock
    private readonly projectTeamCache = CACHE_STORE.getProjectTeam(this.projectId) as ProjectTeamCacheMock;

    async loadData(): Promise<void> {
        try {
            this.projectInfo = await this.projectInfoCache.get(false, this.projectId)
            const fullTeam = await this.projectTeamCache.get(true, this.projectId);
            this.projectTeam.projectLead = fullTeam.projectLead;
            this.projectTeam.assignedValidator = fullTeam.validator[0]
            console.log('Project Info', this.projectInfo)
            console.log("Project Team", this.projectTeam)
        } catch (error) {
            console.error('Failed to load project data', error);
        }
    }

    async render(q: Quark): Promise<void> {
        const loading = new LoadingScreen(q);
        loading.show();

        await this.loadData();
        loading.hide()

        $(q, 'div', 'project-info', {}, (q) => {

            $(q, 'p', 'project-description', {}, this.projectInfo.description)

            $(q, 'div', '', {id: 'basic-info'}, (q) => {
                new OverviewBasicInfo(this.projectId, this.projectInfo.client).render(q)
            })

            $(q, 'section', '', {}, (q) => {
                $(q, 'h2', '', {}, 'Rules and Scope')
                $(q, 'ul', 'section-content', {}, (q) => {
                    this.projectInfo.scope.forEach((rule) => {
                        $(q, 'li', '', {}, rule)
                    })
                })
            })

            $(q, 'section', '', {id: 'payments'}, (q) => {
                $(q, 'h2', '', {}, 'Payments')
                new OverviewPayments(this.projectId).render(q)
            })

            $(q, 'section', '', {id: 'reports'}, (q) => {
                $(q, 'span', '', {}, (q) => {
                    $(q, 'h2', '', {}, 'Reports')
                    new IconButton({
                        icon: 'fa fa-plus',
                        label: 'Create Report',
                        onClick: () => {
                            const url ='/report/' + this.projectId
                            router.navigateTo(url)
                        }
                    }).render(q)
                })


                $(q, 'div', 'section-content', {}, (q) => {
                    new OverviewReports({reportId: '1'}).render(q)
                })
            })

        })
    }
}


