import {QuarkFunction as $, Quark} from '@ui_lib/quark';
import {ClickableTable, ContentItem} from "@components/table/clickable.table";
import {ProjectBrief} from "@data/client/cache/projects.cache";
import { CustomTable } from "@components/table/customTable";
import { router } from "@ui_lib/router";
import { mapProjectStateToClass } from "@/styles/style.util";

export class dashClientProjectRequests {
    private userId: string;
    private headers: string[] = ["ID", "Project Title", "Status", "Date Submitted"]
    private RequestsTableContent: ContentItem[] = [];

    constructor(userId: string, projects: ProjectBrief[]) {
        this.userId = userId;

        for (const item of projects) {
            this.RequestsTableContent.push({
                id: projects.indexOf(item),
                title: item.title,
                status: item.state,
                date: item.startDate,
            });
        }
    }

    async render(q: Quark): Promise<void> {
        (this.RequestsTableContent.length > 0) &&
            $(q, 'div', 'section', {}, (q) => {
                $(q, 'h2', '', {}, 'Project Requests');
                    new CustomTable({
                          content: this.RequestsTableContent,
                          headers: this.headers,
                          className: '',
                        options:{
                            callback: (project) => {
                                router.navigateTo(`/projects/${project.projectId}`);
                            },
                            cellClassName: 'cursor-pointer',
                            cellClassNames: {
                                2: mapProjectStateToClass,
                                1: () => 'width-fit w-min-20'
                            },
                        }
                    }).render(q);
            });
    }

}
