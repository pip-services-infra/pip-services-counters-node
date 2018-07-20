let _ = require('lodash');
let async = require('async');

import { ConfigParams, IOpenable } from 'pip-services-commons-node';
import { IConfigurable } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { IReferenceable } from 'pip-services-commons-node';
import { DependencyResolver } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { CommandSet } from 'pip-services-commons-node';
import { ICommandable } from 'pip-services-commons-node';
import { ContextInfo } from 'pip-services-commons-node';

import { CounterV1 } from '../data/version1/CounterV1';
import { ICountersPersistence } from '../persistence/ICountersPersistence';
import { ICountersController } from './ICountersController';
import { CountersCommandSet } from './CountersCommandSet';

export class CountersController
    implements ICountersController, ICommandable, IConfigurable, IReferenceable, IOpenable {

    private _dependencyResolver: DependencyResolver;
    private _readPersistence: ICountersPersistence;
    private _writePersistence: ICountersPersistence[];
    private _commandSet: CountersCommandSet;
    private _expireCleanupTimeout: number = 60; // 60 min
    private _expireLogsTimeout: number = 3; // 3 days
    private _expireErrorsTimeout: number = 30; // 30 days
    private _interval: any = null;
    private _source: string = "";

    constructor() {
        this._dependencyResolver = new DependencyResolver();
        this._dependencyResolver.put('read_persistence', new Descriptor('pip-services-counters', 'persistence', '*', '*', '*'));
        this._dependencyResolver.put('write_persistence', new Descriptor('pip-services-counters', 'persistence', '*', '*', '*'));
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new CountersCommandSet(this);
        return this._commandSet;
    }

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
        this._expireCleanupTimeout = config.getAsIntegerWithDefault('options.expire_cleanup_timeout', this._expireCleanupTimeout)
        this._expireLogsTimeout = config.getAsIntegerWithDefault('options._expire_logs_timeout', this._expireLogsTimeout)
        this._expireErrorsTimeout = config.getAsIntegerWithDefault('options._expire_errors_timeout', this._expireErrorsTimeout)
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._readPersistence = this._dependencyResolver.getOneRequired<ICountersPersistence>('read_persistence');
        this._writePersistence = this._dependencyResolver.getOptional<ICountersPersistence>('write_persistence');

        let contextInfo = references.getOneOptional<ContextInfo>(
            new Descriptor("pip-services", "context-info", "default", "*", "1.0"));
        if (contextInfo != null && this._source == "")
            this._source = contextInfo.name;
    }

    public isOpened(): boolean {
        return this._interval != null;
    }

    public open(correlationId: string, callback: (err: any) => void): void {
        if (this._interval != null) {
            clearInterval(this._interval);
        }

        this._interval = setInterval(() => {
            this.deleteExpired(correlationId, null);
        }, 1000 * 60 * this._expireCleanupTimeout);

        if (callback != null)
            callback(null);
    }

    public close(correlationId: string, callback: (err: any) => void): void {
        if (this._interval != null) {
            clearTimeout(this._interval);
            this._interval = null;
        }

        if (callback != null)
            callback(null);
    }

    public writeCounter(correlationId: string, counter: CounterV1,
        callback?: (err: any, counter: CounterV1) => void): void {

        counter.source = counter.source || this._source;
        counter.id = counter.name + "_" + counter.source;
        counter.time = counter.time || new Date();

        let lastCounter: CounterV1 = counter;
        async.each(this._writePersistence, (p, callback) => {
            p.addOne(correlationId, counter, (err, data) => {
                lastCounter = data || lastCounter;
                callback(err);
            });
        }, (err) => {
            if (callback) callback(err, lastCounter);
        });
    }

    public writeCounters(correlationId: string, counters: CounterV1[],
        callback?: (err: any) => void): void {

        if (counters == null || counters.length == 0) {
            if (callback) callback(null);
            return;
        }

        _.each(counters, (counter) => {
            counter.source = counter.source || this._source;
            counter.id = counter.name + "_" + counter.source;
            counter.time = counter.time || new Date();
        });

        async.each(this._writePersistence, (p, callback) => {
            p.addBatch(correlationId, counters, callback);
        }, (err) => {
            if (callback) callback(err);
        });
    }

    public readCounters(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<CounterV1>) => void): void {
        this._readPersistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public clear(correlationId: string, callback?: (err: any) => void): void {
        async.each(this._writePersistence, (p, callback) => {
            p.clear(correlationId, callback);
        }, (err) => {
            if (callback) callback(err);
        });
    }

    public deleteExpired(correlationId: string, callback: (err: any) => void) {
        let now = new Date().getTime();
        let expireLogsTime = new Date(now - this._expireLogsTimeout * 24 * 3600000);
        let expireErrorsTime = new Date(now - this._expireErrorsTimeout * 24 * 3600000);

        async.each(this._writePersistence, (p, callback) => {
            p.deleteExpired(correlationId, expireLogsTime, expireErrorsTime, callback);
        }, (err) => {
            if (callback) callback(err);
        });
    }

}
