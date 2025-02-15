import {QuarkFunction as $, Quark} from '@ui_lib/quark';
import {ClickableTable, ContentItem} from "@components/table/clickable.table";
import {Invitation} from "@data/common/cache/invitations.cache";
import {ProjectInfo, ProjectInfoCacheMock} from "@data/validator/cache/projectInfo";
import {Project, ProjectsClientCache} from "@data/client/cache/projects.cache";
import {UserCache} from "@data/user";
import {projectEndpoints} from "@data/client/network/project.network";
import {DataFailure} from "@data/cacheBase";

export class dashClientProjects {
    private userId: string;
    private projectInfoCache = new ProjectsClientCache();
    private headers: string[] = ["Project Title", "Status"]
    private RequestsTableContent: ContentItem[] = [];

    constructor(userId: string) {
        this.userId = userId;
    }

    private async loadProjectInfo(): Promise<void> {
        let response: any;
        try {
            response = (await projectEndpoints.getProjectRequests(this.userId));
            // console.log('Response:', response);
        } catch (error) {
            console.error('Network error while fetching projects:', error);
            throw new DataFailure('load project', 'Network error');
        }

        if (response.state !== 'success') {
            console.error('Failed to load projects:', response.error);
            throw new DataFailure('load project', response.error ?? '');
        }

        const data = response.data.applicationData;
        for (const item of data) {
            console.log(item)
            this.RequestsTableContent.push({
                id: data.indexOf(item),
                title: item.title,
                status: item.state
            });
        }
    }


    async render(q: Quark): Promise<void> {
        await this.loadProjectInfo();
        $(q, 'div', 'invitations', {}, (q) => {
            $(q, 'h2', '', {}, 'Project Requests');
            new ClickableTable(this.RequestsTableContent, this.headers).render(q);
        });

    }

}
