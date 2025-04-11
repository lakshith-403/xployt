import {Quark, QuarkFunction as $} from '@ui_lib/quark';
import {CACHE_STORE} from '@data/cache';
import {View, ViewHandler} from "@ui_lib/view";
import {Card} from "@components/card/card.base";
import {Button} from "@components/button/base";
import {ProjectTeamCache, ProjectTeam} from "@data/common/cache/projectTeam.cache";
import './inviteHackers.scss'
import {InvitationsCache, Hacker} from "@data/common/cache/invitations.cache";
import {Project, ProjectCache} from "@data/common/cache/project.cache";
import {ClientInvitationsCache} from "@data/client/cache/client.invitations.cache";
import LoadingScreen from "@components/loadingScreen/loadingScreen";

export class InviteHackers extends View {
    private projectId: string;
    project = {} as Project;
    projectTeam = {} as ProjectTeam;
    private readonly projectCache: ProjectCache;
    private readonly projectTeamCache: ProjectTeamCache;
    private invitationsCache: InvitationsCache;
    private clientInvitationsCache: ClientInvitationsCache;
    private availableHackers: Hacker[] = [];
    private invitedHackers: Hacker[] = [];
    // private availableHackers = [
    //     {
    //         id: 104,
    //         name: "David Brown",
    //         email: "david.brown@example.com",
    //         blastPoints: 85,
    //         areaOfExpertise: "Web Application Penetration Testing",
    //     },
    //     {
    //         id: 105,
    //         name: "Emma Johnson",
    //         email: "emma.johnson@example.com",
    //         blastPoints: 92,
    //         areaOfExpertise: "Network Security Analysis",
    //     },
    //     {
    //         id: 108,
    //         name: "Hannah Lopez",
    //         email: "hannah.lopez@example.com",
    //         blastPoints: 90,
    //         areaOfExpertise: "Social Engineering and Phishing Attacks",
    //     },
    //     {
    //         id: 109,
    //         name: "Ian Martinez",
    //         email: "ian.martinez@example.com",
    //         blastPoints: 89,
    //         areaOfExpertise: "Cloud Security Penetration Testing",
    //     },
    // ];

    constructor(params: { projectId: string }) {
        super();
        this.projectId = params.projectId;
        this.projectCache = CACHE_STORE.getProject(this.projectId);
        this.projectTeamCache = CACHE_STORE.getProjectTeam(this.projectId);
        this.invitationsCache = new InvitationsCache(this.projectId);
        this.clientInvitationsCache = CACHE_STORE.getInvitedHackers(this.projectId);
    }

    async loadData(): Promise<void> {
        try {
            this.project = await this.projectCache.get(false, this.projectId) as Project;
            this.projectTeam = await this.projectTeamCache.get(false, this.projectId) as ProjectTeam;
            this.availableHackers = await this.invitationsCache.filterHackers(this.projectId);
            this.invitedHackers = await this.clientInvitationsCache.get(false, this.projectId);
        } catch (error) {
            console.error('Failed to load project data:', error);
        }
    }

    async sendInvitation(hackerId: string, parent: Quark): Promise<void> {
        try {
            // Send the invitation
            await this.invitationsCache.create(this.projectId, hackerId);

            // Update the lists
            const hackerIndex = this.availableHackers.findIndex(hacker => hacker.userId === parseInt(hackerId));
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

    private renderHackerList(q: Quark, hackers: Hacker[], parent: Quark) {
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
                                    // hacker.skills.forEach((skill) => {
                                    //     $(q, 'p', 'value', {}, skill);
                                    // });
                                    $(q, 'p', 'value', {},);
                                });
                                $(q, 'p', 'value link', {}, hacker.email);
                            });
                        })
                        $(q, 'div', 'points', {}, (q) => {
                            new Button({
                                label: 'Invite',
                                onClick: async () => {
                                    await this.sendInvitation(hacker.userId.toString(), parent);
                                }
                            }).render(q)
                            $(q, 'span', 'data-field', {}, (q) => {
                                $(q, 'span', 'key', {}, (q) => {
                                    $(q, 'i', 'fa-solid fa-bomb', {});
                                });
                                $(q, 'sapn', 'value', {}, hacker.points.toString());
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
                    content: $(q, 'div', 'card-content', {}, (q) => {
                        $(q, 'div', 'details', {}, (q) => {
                            $(q, 'span', 'card-title', {}, `${hacker.name}`)
                            $(q, 'div', 'description', {}, (q) => {
                                $(q, 'span', '', {}, (q) => {
                                    $(q, 'p', 'key', {}, 'Area of Expertise');
                                    // hacker.skills.forEach((skill) => {
                                    //     $(q, 'p', 'value', {}, skill);
                                    // });
                                    $(q, 'p', 'value', {},);
                                });
                                $(q, 'p', 'value link', {}, hacker.email);
                            });
                        })
                        $(q, 'div', 'points', {}, (q) => {
                            $(q, 'span', 'data-field', {}, (q) => {
                                $(q, 'span', 'key', {}, (q) => {
                                    $(q, 'i', 'fa-solid fa-bomb', {});
                                });
                                $(q, 'sapn', 'value', {}, hacker.points.toString());
                            });
                        });
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

        const loading = new LoadingScreen(container);

        loading.show();
        await this.loadData();
        loading.hide();

        $(parent, 'div', 'client-invitations', {}, (q) => {
            $(q, 'div', 'section-header', {}, (q) => {
                $(q, 'h1', 'section-title', {}, (q) => {
                    q.innerHTML = "Invite Hackers | " + `${(this.project.title)} - #${this.project.projectId}`;
                });
                $(q, 'p', '', {}, this.project.description)
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

export const clientHackerInvitationsViewHandler = new ViewHandler(`/invite-hackers/{projectId}`, InviteHackers);

