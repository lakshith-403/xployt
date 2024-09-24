import {Quark, QuarkFunction as $} from "@ui_lib/quark";
import {CACHE_STORE} from "@data/cache";
import {ProjectTeamCacheMock} from "@data/validator/cache/project.team";
import LoadingScreen from "@components/loadingScreen/loadingScreen";
import {Card} from "@components/card/card.base";
import '../tabOverview.scss'

export class OverviewBasicInfo {
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

    constructor(private readonly projectId: string, private readonly client: string) {
        this.projectId = projectId;
        this.client = client;
        console.log(this.client)
    }

    private readonly projectTeamCache = CACHE_STORE.getProjectTeam(this.projectId) as ProjectTeamCacheMock;

    async loadData(): Promise<void> {
        try {
            const fullTeam = await this.projectTeamCache.get(true, this.projectId);
            this.projectTeam.projectLead = fullTeam.projectLead;
            this.projectTeam.assignedValidator = fullTeam.validator[0]
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

        $(q, 'div', 'section-content', {}, (q) => {
            $(q, 'div', '', {}, (q) => {
                $(q, 'span', '', {}, (q) => {
                    $(q, 'p', 'key', {}, 'Client')
                    $(q, 'p', 'value', {}, this.client)
                })
                $(q, 'span', '', {}, (q) => {
                    $(q, 'p', 'key', {}, "Access Link")
                    $(q, 'a', 'key link', {href: '#', target: '_blank'}, 'www.example.com')
                })
            })
            $(q, 'div', '', {}, (q) => {
                Object.entries(this.projectTeam).forEach(([key, teamMember]) => {
                    const title = convertToTitleCase(key);

                    new Card({
                        title: title,
                        content: $(q, 'div', 'description', {}, (q) => {
                            $(q, 'span', '', {}, (q) => {
                                $(q, 'p', 'value', {}, teamMember.name);
                                $(q, 'p', 'value caption', {}, teamMember.username);
                            })
                            $(q, 'p', 'value link', {}, teamMember.email);
                        })
                    }).render(q);
                });
            })
        })
    }
}

function convertToTitleCase(input: string): string {
    const words = input.replace(/([A-Z])/g, ' $1').trim();
    return words.replace(/\w\S*/g, (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
}