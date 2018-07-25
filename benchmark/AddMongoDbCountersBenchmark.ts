let async = require('async');

import { Benchmark } from 'pip-benchmark-node';
import { DateTimeConverter } from 'pip-services-commons-node';

import { ConfigParams } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';

import { ErrorDescription } from 'pip-services-commons-node';
import { CounterV1 } from '../src/data/version1/CounterV1';
import { PerfMonMongoDbPersistence } from '../src/persistence/PerfMonMongoDbPersistence';
import { PerfMonController } from '../src/logic/PerfMonController';

export class AddMongoDbCountersBenchmark extends Benchmark {
    private _initialRecordNumber: number;
    private _sourceQuantity: number;
    private _startTime: Date;
    private _interval: number;

    private _source: string;
    private _time: Date;

    private _persistence: PerfMonMongoDbPersistence;
    private _controller: PerfMonController;

    public constructor() {
        super("AddMongoDbCounters", "Measures performance of adding Counters into MongoDB database");
    }

    public setUp(callback: (err: any) => void): void {
        this._initialRecordNumber = this.context.parameters.InitialRecordNumber.getAsInteger();
        this._sourceQuantity = this.context.parameters.SourceQuantity.getAsInteger();
        this._startTime = DateTimeConverter.toDateTime(this.context.parameters.StartTime.getAsString());
        this._interval = this.context.parameters.Interval.getAsInteger();

        this._time = this._startTime;
        this._source = this.getRandomString(10);

        let mongoUri = this.context.parameters.MongoUri.getAsString();
        let mongoHost = this.context.parameters.MongoHost.getAsString();
        let mongoPort = this.context.parameters.MongoPort.getAsInteger();
        let mongoDb = this.context.parameters.MongoDb.getAsString();

        this._persistence = new PerfMonMongoDbPersistence();
        this._persistence.configure(ConfigParams.fromTuples(
            'connection.uri', mongoUri,
            'connection.host', mongoHost,
            'connection.port', mongoPort,
            'connection.database', mongoDb
        ));

        this._controller = new PerfMonController();

        let references: References = References.fromTuples(
            new Descriptor('pip-services-perfmon', 'persistence', 'mongodb', 'default', '1.0'), this._persistence,
            new Descriptor('pip-services-perfmon', 'controller', 'default', 'default', '1.0'), this._controller
        );
        this._controller.setReferences(references);

        this._persistence.open(null, (err) => {
            if (err == null)
                this.context.sendMessage('Connected to mongodb database');
            callback(err);
        });

    }

    public tearDown(callback: (err: any) => void): void {
        this._persistence.close(null, (err) => {
            if (this.context)
                this.context.sendMessage('Disconnected from mongodb database');
            callback(err);
        });

        this._persistence = null;
        this._controller = null;
    }

    private getRandomString(length: number): string {
        return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
    }

    private getRandomInteger(min: number, max: number): number {
        return Math.floor(Math.floor(Math.random() * (max - min)) + min);
    }

    public execute(callback: (err: any) => void): void {
        let counters: CounterV1[] = [];

        for (let siteNumber = 1; siteNumber <= this._sourceQuantity; siteNumber++) {
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