//Inicialización de parámetros
const { config } = require('../../config');
const { MongoClient, ObjectId } = require('mongodb');

//Variables de entorno
const USER = encodeURIComponent(config.dbUser);
const HOST = encodeURIComponent(config.dbHost);
const DB_NAME = encodeURIComponent(config.dbName);
const PASSWORD = encodeURIComponent(config.dbPassword);
const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${HOST}.ulcrj.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

//Inicialización del objeto de la base de datos conectada a Mongo
class Database {
    collectionName;
    constructor() {
        this.client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
        this.dbName = DB_NAME;
    }
    connect() {
        if (!Database.connection) {
            Database.connection = new Promise((resolve, reject) => {
                this.client.connect(err => {
                    if (err) {
                        reject(err);
                    }
                    console.log('Conectado a MongoDB');
                    resolve(this.client.db(this.dbName));
                });
            });
        }
        return Database.connection;
    }

    useCollection(name) {
        this.collectionName = name;
    }

    create(data) {
        return this.connect()
        .then(db => {
          return db
          .collection(this.collectionName)
          .insertOne(data);
        })
        .then(result => result.insertedId);
    }

    getAll(filters={}) {
        return this.connect()
        .then(db => {
            return db
            .collection(this.collectionName)
            .find(filters)
            .toArray();
        });
    }

    get(id) {
        return this.connect()
        .then(db => {
            return db
            .collection(this.collectionName)
            .findOne({ _id: ObjectId(id) });
        });
    }

    update(id, data) {
        return this.connect()
        .then(db => {
            return db
            .collection(this.collectionName)
            .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
        })
        .then(result => result.upsertedId || id);
    }

    delete(id) {
        return this.connect()
        .then(db => {
          return db
          .collection(this.collectionName)
          .deleteOne({ _id: ObjectId(id) });
        })
        .then(() => id);
    }
}

module.exports = Database;