export default class Favorite {
    id!: number
    name!: string
    url!: string
    // tslint:disable-next-line:variable-name
    user_id: number

    constructor(name: string, url: string, userId: number) {
        this.name = name;
        this.url = url;
        this.user_id = userId
    }
}
