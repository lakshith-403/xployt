import {UserCache} from "./user";
import {ProjectInfoCacheMock, ProjectInfoCache} from "./projectInfo";

class CacheStore {
    private readonly userMap: Map<string, UserCache>
    private readonly projectInfoMap: Map<string, ProjectInfoCacheMock>

    constructor() {
        this.userMap = new Map()
        this.projectInfoMap = new Map()
    }

    public getUser(username: string): UserCache {
        if (!this.userMap.has(username)) {
            this.userMap.set(username, new UserCache())
        }

        return this.userMap.get(username)!
    }
    public getProjectInfo(projectId: string): ProjectInfoCache {
        if (!this.projectInfoMap.has(projectId)) {
            this.projectInfoMap.set(projectId, new ProjectInfoCacheMock())
        }

        return this.projectInfoMap.get(projectId)!
    }
}

export const CACHE_STORE = new CacheStore()