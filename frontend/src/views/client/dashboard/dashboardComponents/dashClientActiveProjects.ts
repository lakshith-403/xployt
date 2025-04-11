import {QuarkFunction as $, Quark} from '@ui_lib/quark';
import {ClickableTable, ContentItem} from "@components/table/clickable.table";
import {ProjectBrief} from "@data/client/cache/projects.cache";
import {router} from "@ui_lib/router";

export class dashClientActiveProjects {
    private userId: string;
    private headers: string[] = ["Project Title", "Start Date", "End Date"]
    private TableContent: ContentItem[] = [];
    private projects: ProjectBrief[] = [];

    constructor(userId: string, projects: ProjectBrief[]) {
        this.userId = userId;
        this.projects = projects;

        for (const project of projects) {
            this.TableContent.push({
                id: project.id,
                title: project.title,
                startDate: project.startDate,
                endDate: project.endDate,
            });
        }
    }

    public navigate = (id: number) => {
        router.navigateTo(`/projects/${id}`);
    }

    async render(q: Quark): Promise<void> {
        console.log('active projects', this.projects);
        (this.TableContent.length > 0) ?
            $(q, 'div', 'section', {}, (q) => {
                $(q, 'h2', '', {}, 'Active Projects');
                new ClickableTable(this.TableContent, this.headers, '', this.navigate).render(q);
            })
            :
            $(q, 'p', '', {}, 'No active projects');
    }

}
