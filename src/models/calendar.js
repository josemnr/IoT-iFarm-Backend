const Database = require('./database');

class Employee extends Database {
    constructor() {
        console.log('Inicializando modelo Calendar...');
        super();
        this.useCollection('calendar');
    }
}

module.exports = new Employee();