const Database = require('./database');

class Greenhouse extends Database {
    constructor() {
        console.log('Inicializando modelo Greenhouse...');
        super();
        this.useCollection('greenhouse');
    }
}

module.exports = new Greenhouse();