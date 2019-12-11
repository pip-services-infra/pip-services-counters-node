let _ = require('lodash');
let async = require('async');

import { ConfigParams, IOpenable } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { ContextInfo } from 'pip-services3-components-node';

import { CounterV1 } from '../data/version1/CounterV1';
import { ICountersPersistence } from '../persistence/ICountersPersistence';
import { ICountersController } from './ICountersController';
import { CountersCommandSet } from './CountersCommandSet';

export class CountersController
    implements ICountersController, ICommandable, IConfigurable, IReferenceable, IOpenable {

    private _dependencyResolver: DependencyResolver;
    private _persistence: ICountersPersistence;
    private _commandSet: CountersCommandSet;
    private _expireCleanupTimeout: number = 60; // 60 min
    private _expireTimeout: number = 3; // 3 days
    private _interval: any = null;

    constructor() {
        this._dependencyResolver = new DependencyResolver();
        this._dependencyResolver.put('persistence', new Descriptor('pip-services-counters', 'persistence', '*', '*', '*'));
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new CountersCommandSet(this);
        return this._commandSet;
    }

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
        this._expireCleanupTimeout = config.getAsIntegerWithDefault('options.expire_cleanup_timeout', this._expireCleanupTimeout)
        this._expireTimeout = config.getAsIntegerWithDefault('options._expire_counter_timeout', this._expireTimeout)
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<ICountersPersistence>('persistence');
    }

    public isOpen(): boolean {
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
        counter.id = counter.name + "_" + counter.source;
        counter.time = counter.time || new Date();

        this._persistence.addOne(correlationId, counter, callback);
    }

    public writeCounters(correlationId: string, counters: CounterV1[],
        callback?: (err: any) => void): void {

        if (counters == null || counters.length == 0) {
            if (callback) callback(null);
            return;
        }

        _.each(counters, (counter) => {
            counter.id = counter.name + "_" + counter.source;
            counter.time = counter.time || new Date();
        });

        this._persistence.addBatch(correlationId, counters, callback);
    }

    public readCounters(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<CounterV1>) => void): void {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public clear(correlationId: string, callback?: (err: any) => void): void {
        this._persistence.clear(correlationId, callback);
    }

    public deleteExpired(correlationId: string, callback: (err: any) => void) {
        let now = new Date().getTime();
        let expireTime = new Date(now - this._expireTimeout * 24 * 3600000);

        this._persistence.deleteExpired(correlationId, expireTime, callback);
    }

}
