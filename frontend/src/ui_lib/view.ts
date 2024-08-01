import {Quark} from "./quark"

export abstract class View {
    public render(q: Quark) {

    }
}

export class ViewHandler {
    route: string
    private readonly builder:  new (params: any) => View
    private view: View

    constructor(route: string, builder: new (params: any) => View) {
        this.route = route
        this.builder = builder
    }

    setView(params?: Record<string, string>) {
        let root = document.getElementById('root')
        root.innerHTML = ''

        this.view = new this.builder(params)
        this.view.render(root)
    }
}
