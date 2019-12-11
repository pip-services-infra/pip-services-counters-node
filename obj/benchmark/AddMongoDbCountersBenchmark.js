"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let async = require('async');
const pip_benchmark_node_1 = require("pip-benchmark-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const CountersMongoDbPersistence_1 = require("../src/persistence/CountersMongoDbPersistence");
const CountersController_1 = require("../src/logic/CountersController");
class AddMongoDbCountersBenchmark extends pip_benchmark_node_1.Benchmark {
    constructor() {
        super("AddMongoDbCounters", "Measures performance of adding Counters into MongoDB database");
    }
    setUp(callback) {
        this._initialRecordNumber = this.context.parameters.InitialRecordNumber.getAsInteger();
        this._sourceQuantity = this.context.parameters.SourceQuantity.getAsInteger();
        this._startTime = pip_services3_commons_node_1.DateTimeConverter.toDateTime(this.context.parameters.StartTime.getAsString());
        this._interval = this.context.parameters.Interval.getAsInteger();
        this._time = this._startTime;
        this._source = this.getRandomString(10);
        let mongoUri = this.context.parameters.MongoUri.getAsString();
        let mongoHost = this.context.parameters.MongoHost.getAsString();
        let mongoPort = this.context.parameters.MongoPort.getAsInteger();
        let mongoDb = this.context.parameters.MongoDb.getAsString();
        this._persistence = new CountersMongoDbPersistence_1.CountersMongoDbPersistence();
        this._persistence.configure(pip_services3_commons_node_2.ConfigParams.fromTuples('connection.uri', mongoUri, 'connection.host', mongoHost, 'connection.port', mongoPort, 'connection.database', mongoDb));
        this._controller = new CountersController_1.CountersController();
        let references = pip_services3_commons_node_4.References.fromTuples(new pip_services3_commons_node_3.Descriptor('pip-services-counters', 'persistence', 'mongodb', 'default', '1.0'), this._persistence, new pip_services3_commons_node_3.Descriptor('pip-services-counters', 'controller', 'default', 'default', '1.0'), this._controller);
        this._controller.setReferences(references);
        this._persistence.open(null, (err) => {
            if (err == null)
                this.context.sendMessage('Connected to mongodb database');
            callback(err);
        });
    }
    tearDown(callback) {
        this._persistence.close(null, (err) => {
            if (this.context)
                this.context.sendMessage('Disconnected from mongodb database');
            callback(err);
        });
        this._persistence = null;
        this._controller = null;
    }
    getRandomString(length) {
        return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
    }
    getRandomInteger(min, max) {
        return Math.floor(Math.floor(Math.random() * (max - min)) + min);
    }
    execute(callback) {
        let counters = [];
        for (let sourceNumber = 1; sourceNumber <= this._sourceQuantity; sourceNumber++) {
            counters.push({
                id: this.getRandomString(10),
                name: this.getRandomString(10),
                time: this._time,
                source: this.getRandomString(10),
                type: this.getRandomInteger(0, 4),
                last: this.getRandomInteger(0, 10),
                count: this.getRandomInteger(0, 10),
                min: this.getRandomInteger(0, 10),
                max: this.getRandomInteger(0, 10),
                average: this.getRandomInteger(0, 10),
            });
        }
        this._time = new Date(this._time.getTime() + this._interval);
        this._controller.writeCounters(null, counters, callback);
    }
}
exports.AddMongoDbCountersBenchmark = AddMongoDbCountersBenchmark;
//# sourceMappingURL=AddMongoDbCountersBenchmark.js.map