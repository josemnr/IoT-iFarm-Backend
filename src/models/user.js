const Database = require('./database');

class Users extends Database {
    constructor() {
        console.log('Inicializando modelo Users...');
        super();
        this.useCollection('users');
    }
}

module.exports = new Users();