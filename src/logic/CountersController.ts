let async = require('async');

import { ConfigParams } from 'pip-services-commons-node';
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

import { CounterV1 } from '../data/version1/CounterV1';
import { ICountersPersistence } from '../persistence/ICountersPersistence';
import { ICountersController } from './ICountersController';
import { CountersCommandSet } from './CountersCommandSet';

export class CountersController 
    implements ICountersController, ICommandable, IConfigurable, IReferenceable {
    
    private _dependencyResolver: DependencyResolver;
	private _readPersistence: ICountersPersistence;
	private _writePersistence: ICountersPersistence[];
    private _commandSet: CountersCommandSet;
    
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
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._readPersistence = this._dependencyResolver.getOneRequired<ICountersPersistence>('read_persistence');
        this._writePersistence = this._dependencyResolver.getOptional<ICountersPersistence>('write_persistence');
    }

    public writeCounter(correlationId: string, counter: CounterV1,
        callback?: (err: any, counter: CounterV1) => void): void {
        async.each(this._writePersistence, (p, callback) => {
            p.create(correlationId, counter, callback);
        }, (err) => {
            if (callback) callback(err, counter);
        });
    }
    
    public writeCounters(correlationId: string, counters: CounterV1[],
        callback?: (err: any) => void): void {
        async.each(this._writePersistence, (p, callback) => {
            async.each(counters, (m, callback) => {
                p.create(correlationId, m, callback);
            }, callback);
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
    
}
