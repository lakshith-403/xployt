import { CacheObject, DataFailure } from '../../cacheBase';
import { hackerProjectInfoEndpoints }  from "../network/hacker.projectInfo.network";

export class HackerProjectInfo {
    id: number;
    title: string;
    client: string;
    startDate: string;
    endDate: string;
    description: string;
    scope: string;

    constructor(data: any) {
        this.id = data['id'];
        this.title = data['title'];
        this.client = data['client'];
        this.startDate = data['startDate'];
        this.endDate = data['endDate'];
        this.description = data['description'];
        this.scope = data['scope'];
    }
}

export class HackerProjectInfoCache extends CacheObject<HackerProjectInfo> {
    async load(arg: string[]): Promise<HackerProjectInfo> {
        const response = await hackerProjectInfoEndpoints.getHackerProjectInfo(arg[0]);

        if (!response.is_successful)
            throw new DataFailure('load project', response.error ?? '');

        return new HackerProjectInfo(response.data);
    }
}

export class HackerProjectInfoCacheMock extends CacheObject<HackerProjectInfo>{
    async load(arg: string[]): Promise<HackerProjectInfo> {
        if (arg[0] === '1') {
            return new HackerProjectInfo({
                id: 1,
                title: 'Project GT-2002',
                client: 'Client 1',
                startDate: '2021-01-01',
                endDate: '2021-12-31',
                description: 'Description of project 1',
                scope: 'Scope of project 1',
            });
        }
        return new HackerProjectInfo({
            id: 2,
            title: 'Project WV-102',
            client: 'Client 2',
            startDate: '2021-01-01',
            endDate: '2021-12-31',
            description: 'Description of project 1',
            scope: 'Scope of project 1',
        });
    }
}