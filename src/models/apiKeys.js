const Database = require('./database');

class ApiKeys extends Database {
    constructor() {
        console.log('Inicializando modelo api-keys...');
        super();
        this.useCollection('api-keys');
    }
}

module.exports = new ApiKeys();