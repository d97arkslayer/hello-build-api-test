import {v4 as uuidv4} from "uuid";

/**
 * This is the model of user
 */
export default class User {
    id!: string;
    name: string;
    lastname!: string;
    email!: string;
    password!: string;

    constructor(name: string, lastname: string, email: string, password: string, id: string = null) {
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.id = id || uuidv4();
    }
}
