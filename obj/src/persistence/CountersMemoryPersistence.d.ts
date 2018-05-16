import { ConfigParams } from 'pip-services-commons-node';
import { IConfigurable } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { CounterV1 } from '../data/version1/CounterV1';
export declare class CountersMemoryPersistence implements IConfigurable {
    private _maxPageSize;
    private _counters;
    constructor();
    configure(config: ConfigParams): void;
    private matchString(value, search);
    private counterContains(counter, search);
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<CounterV1>) => void): void;
    private mergeCounters(oldCounter, counter);
    create(correlationId: string, counter: CounterV1, callback?: (err: any, counter: CounterV1) => void): void;
    clear(correlationId: string, callback?: (err: any) => void): void;
}
