import {UserCache} from "./user";

class CacheStore {
    private readonly userMap: Map<string, UserCache>

    constructor() {
        this.userMap = new Map()
    }

    public getUser(username: string): UserCache {
        if (!this.userMap.has(username)) {
            this.userMap.set(username, new UserCache())
        }

        return this.userMap.get(username)!
    }
}

export const CACHE_STORE = new CacheStore()