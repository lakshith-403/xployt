import { Quark, QuarkFunction as $ } from "@ui_lib/quark";
import UserCard from "@components/UserCard";

export class ReportHeader {
    private projectId: string;

    constructor(projectId: string) {
        this.projectId = projectId;
    }

    async render(q: Quark): Promise<void> {
        $(q, 'div', 'report-review-header', {}, async (q) => {
            await new UserCard('105', 'hacker', 'hacker flex-1', 'Hacker', {
                highLightKeys: ['email'],
                highlightClassName: 'highlight',
                showKeys: ['name', 'email']
            }).render(q);

            $(q, 'div', 'project-info', {}, (q) => {
                $(q, 'span', 'project-element align-center', {}, (q) => {
                    $(q, 'p', 'label', {}, 'Project ID');
                    $(q, 'p', '', {}, this.projectId);
                });
                $(q, 'span', 'project-element align-center', {}, (q) => {
                    $(q, 'p', 'label', {}, 'Access Link');
                    $(q, 'a', 'highlight', {}, `https://example.com/${this.projectId}`);
                });
            });
        });
    }
}