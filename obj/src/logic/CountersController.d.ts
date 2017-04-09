import { ConfigParams } from 'pip-services-commons-node';
import { IConfigurable } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { IReferenceable } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { CommandSet } from 'pip-services-commons-node';
import { ICommandable } from 'pip-services-commons-node';
import { CounterV1 } from '../data/version1/CounterV1';
import { ICountersBusinessLogic } from './ICountersBusinessLogic';
export declare class CountersController implements ICountersBusinessLogic, ICommandable, IConfigurable, IReferenceable {
    private _dependencyResolver;
    private _readPersistence;
    private _writePersistence;
    private _commandSet;
    constructor();
    getCommandSet(): CommandSet;
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    writeCounter(correlationId: string, counter: CounterV1, callback?: (err: any, counter: CounterV1) => void): void;
    writeCounters(correlationId: string, counters: CounterV1[], callback?: (err: any) => void): void;
    readCounters(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<CounterV1>) => void): void;
    clear(correlationId: string, callback?: (err: any) => void): void;
}
