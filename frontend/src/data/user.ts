import NETWORK from "./network"
import {CacheObject, DataFailure} from "./cache"

export class User {
    id: number
    username: string
    email: string

    constructor(data: any) {
        this.id = data['id']
        this.username = data['username']
        this.email = data['email']
    }
}

export class UserCache extends CacheObject<User> {
    async load(): Promise<User> {
        const response = await NETWORK.getCurrentUser()

        if (!response.is_successful)
            throw new DataFailure("load user", response.error ?? "")

        return new User(response['data'])
    }

    async signIn(username: string, password: string): Promise<User> {
        const response = await NETWORK.signIn(username, password)

        if (!response.is_successful)
            throw new DataFailure("load user", response.error ?? "")

        return new User(response.data)
    }

    async signOut(): Promise<void> {
        const response = await NETWORK.signOut()

        if (!response.is_successful)
            throw new DataFailure("load user", response.error ?? "")

        this.invalidate_cache()
    }
}