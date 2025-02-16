import {QuarkFunction as $, Quark} from '@ui_lib/quark';
import {ClickableTable, ContentItem} from "@components/table/clickable.table";
import {Project} from "@data/client/cache/projects.cache";

export class dashClientProjectRequests {
    private userId: string;
    private headers: string[] = ["Project Title", "Status"]
    private RequestsTableContent: ContentItem[] = [];

    constructor(userId: string, projects: Project[]) {
        this.userId = userId;

        for (const item of projects) {
            this.RequestsTableContent.push({
                id: projects.indexOf(item),
                title: item.title,
                status: item.state,
            });
        }
    }

    async render(q: Quark): Promise<void> {
        (this.RequestsTableContent.length > 0) &&
            $(q, 'div', 'section', {}, (q) => {
                $(q, 'h2', '', {}, 'Project Requests');
                    new ClickableTable(this.RequestsTableContent, this.headers).render(q);
            });
    }

}
