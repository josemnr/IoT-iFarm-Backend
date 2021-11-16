const Database = require('./database');

class Feedback extends Database {
    constructor() {
        console.log('Inicializando modelo Feedback...');
        super();
        this.useCollection('feedback');
    }
}

module.exports = new Greenhouse();