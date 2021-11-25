export default class Favorite {
    id!: number
    name!: string
    // tslint:disable-next-line:variable-name
    github_id!: string
    // tslint:disable-next-line:variable-name
    created_at!: string
    description!: string
    owner!: string
    // tslint:disable-next-line:variable-name
    user_id: number

    constructor(name: string, githubId: string, userId: number, createdAt: string, description: string, owner: string) {
        this.name = name;
        this.github_id = githubId;
        this.user_id = userId;
        this.created_at = createdAt;
        this.owner = owner;
        this.description = description;

    }
}
