const Database = require('./database');

class Seed extends Database {
    constructor() {
        console.log('Inicializando modelo Seed...');
        super();
        this.useCollection('seed');
    }
}

module.exports = new Seed();