import {Quark, QuarkFunction as $} from '@ui_lib/quark';
import {CACHE_STORE} from '@data/cache';
import {View, ViewHandler} from "@ui_lib/view";
import {Card} from "@components/card/card.base";
import {Button} from "@components/button/base";
import {ProjectInfo, ProjectInfoCacheMock} from "@data/validator/cache/projectInfo";
import {ProjectTeamCache, ProjectTeam} from "@data/common/cache/projectTeam.cache";
import './inviteHackers.scss'
import {InvitationsCache} from "@data/common/cache/invitations.cache";

interface Hacker {
    id: number,
    name: string,
    email: string,
    blastPoints: number,
    areaOfExpertise: string
}

export class InviteHackers extends View {
    projectId: string = "1";
    projectInfo = {} as ProjectInfo;
    projectTeam = {} as ProjectTeam;
    private readonly projectInfoCache: ProjectInfoCacheMock;
    private readonly projectTeamCache: ProjectTeamCache;
    private invitationsCache: InvitationsCache = new InvitationsCache();
    private availableHackers = [
        {
            id: 104,
            name: "David Brown",
            email: "david.brown@example.com",
            blastPoints: 85,
            areaOfExpertise: "Web Application Penetration Testing",
        },
        {
            id: 105,
            name: "Emma Johnson",
            email: "emma.johnson@example.com",
            blastPoints: 92,
            areaOfExpertise: "Network Security Analysis",
        },
        {
            id: 108,
            name: "Hannah Lopez",
            email: "hannah.lopez@example.com",
            blastPoints: 90,
            areaOfExpertise: "Social Engineering and Phishing Attacks",
        },
        {
            id: 109,
            name: "Ian Martinez",
            email: "ian.martinez@example.com",
            blastPoints: 89,
            areaOfExpertise: "Cloud Security Penetration Testing",
        },
    ];
    private invitedHackers: Hacker[] = [];


    constructor(params: { projectId: string }) {
        super();
        // this.projectId = params.projectId;
        console.log(this.projectId)
        this.projectInfoCache = CACHE_STORE.getProjectInfo(this.projectId);
        this.projectTeamCache = CACHE_STORE.getProjectTeam(this.projectId);
    }

    async loadData(): Promise<void> {
        try {
            this.projectInfo = await this.projectInfoCache.get(false, this.projectId) as ProjectInfo;
            console.log(this.projectInfo)
            this.projectTeam = await this.projectTeamCache.get(false, this.projectId) as ProjectTeam;
        } catch (error) {
            console.error('Failed to load project data:', error);
        }
    }

    async sendInvitation(hackerId: string, parent:Quark): Promise<void> {
        try {
            // Send the invitation
            await this.invitationsCache.create(this.projectId, hackerId);

            // Update the lists
            const hackerIndex = this.availableHackers.findIndex(hacker => hacker.id === parseInt(hackerId));
            if (hackerIndex !== -1) {
                const [invitedHacker] = this.availableHackers.splice(hackerIndex, 1);
                this.invitedHackers.push(invitedHacker);
            }

            // Re-render the specific sections
            // this.renderInvitedHackers(invited, this.invitedHackers);
            // this.renderHackerList(available, this.availableHackers);

            await this.render(parent)
        } catch (error) {
            console.error("Failed to send invitation:", error);
        }
    }

    private renderHackerList(q: Quark,  hackers: Hacker[], parent: Quark) {
        q.innerHTML = '';
        hackers.forEach((hacker) => {
            new Card({
                title: '',
                content:
                    $(q, 'div', 'card-content', {}, (q) => {
                        $(q, 'div', 'details', {}, (q) => {
                            $(q, 'span', 'card-title', {}, `${hacker.name}`)
                            $(q, 'div', 'description', {}, (q) => {
                                $(q, 'span', '', {}, (q) => {
                                    $(q, 'p', 'key', {}, 'Area of Expertise');
                                    $(q, 'p', 'value', {}, hacker.areaOfExpertise);
                                });
                                $(q, 'p', 'value link', {}, hacker.email);
                            });
                        })
                        $(q, 'div', 'points', {}, (q) => {
                            new Button({
                                label: 'Invite',
                                onClick: () => {
                                    this.sendInvitation(hacker.id.toString(), parent);
                                }
                            }).render(q)
                            $(q, 'span', 'data-field', {}, (q) => {
                                $(q, 'span', 'key', {}, (q) => {
                                    $(q, 'i', 'fa-solid fa-bomb', {});
                                });
                                $(q, 'sapn', 'value', {}, hacker.blastPoints.toString());
                            });
                        });
                    }),
            }).render(q);
        })
    }

    private renderInvitedHackers(q: Quark, hackers: Hacker[]) {
        q.innerHTML = '';
        if (hackers.length > 0) {
            hackers.forEach(hacker => {
                new Card({
                    title: hacker.name,
                    content: $(q, 'div', 'description', {}, (q) => {
                        $(q, 'p', 'value', {}, hacker.name);
                        $(q, 'p', 'value link', {}, hacker.email);
                    }),
                }).render(q);
            });
        } else {
            q.innerHTML = '<p>No hackers invited yet.</p>';
        }
    }

    async render(container: Quark): Promise<void> {
        const parent: Quark = container;
        parent.innerHTML = '';
        await this.loadData();
        $(parent, 'div', 'client-invitations', {}, (q) => {
            $(q, 'div', 'section-header', {}, (q) => {
                $(q, 'h1', 'section-title', {}, (q) => {
                    q.innerHTML = "Invite Hackers | " + `${(this.projectInfo.title)} - #${this.projectInfo.id}`;
                });
                $(q, 'p', '', {}, this.projectInfo.description)
            });
            $(q, 'div', 'sections', {}, (q) => {
                $(q, 'div', 'section-content project-brief', {}, (q) => {
                    // $(q, 'h2', 'section-subtitle', {}, (q) => {
                    //     q.innerHTML = `#${this.projectInfo.id} | ${(this.projectInfo.title)}`;
                    // });
                    $(q, 'span', 'data-field', {}, (q) => {
                        $(q, 'p', 'key', {}, 'Client');
                        $(q, 'p', 'value', {}, `${this.projectTeam.client.name}`);
                    });
                    $(q, 'span', 'data-field', {}, (q) => {
                        $(q, 'p', 'key', {}, 'Project Lead');
                        $(q, 'p', 'value', {}, `${this.projectTeam.projectLead.name}`);
                    });
                    $(q, 'span', 'data-field', {}, (q) => {
                        $(q, 'p', 'key', {}, 'Access Link');
                        $(q, 'a', 'key link', {href: '#', target: '_blank'}, 'www.example.com');
                    });
                    $(q, 'div', 'hacker-list', {}, (q) => {
                        $(q, 'h2', 'section-subtitle', {}, (q) => {
                            q.innerHTML = "Active Hackers";
                        });
                        Object.entries(this.projectTeam.getHackersWithoutId()).forEach(([key, teamMember]) => {
                            console.log(key);
                            new Card({
                                title: teamMember.name,
                                content: $(q, 'div', 'description', {}, (q) => {
                                    // $(q, 'span', '', {}, (q) => {
                                    //     $(q, 'p', 'value', {}, teamMember.name);
                                    // });
                                    $(q, 'p', 'value link', {}, teamMember.email);
                                }),
                            }).render(q);
                        });
                        $(q, 'h2', 'section-subtitle', {}, (q) => {
                            q.innerHTML = "Invited Hackers";
                        });
                        const invitedHackersContainer = $(q, 'div', 'hacker-list', {}, (q) => {
                            this.renderInvitedHackers(q, this.invitedHackers);
                        });
                    });
                });
                $(q, 'div', 'section-content', {}, (q) => {
                    $(q, 'h2', 'section-subtitle', {}, "Available Hackers");
                    const availableHackersContainer = $(q, 'div', 'hacker-list available', {}, (q) => {
                        this.renderHackerList(q, this.availableHackers, parent);
                    });
                });
            });
        });
    }
}

export const clientHackerInvitationsViewHandler = new ViewHandler('/invite-hackers', InviteHackers);

