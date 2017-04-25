import { DataPage } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { ICleanable } from 'pip-services-commons-node';

import { CounterV1 } from '../data/version1/CounterV1';

export interface ICountersController extends ICleanable {
    readCounters(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<CounterV1>) => void): void;

    writeCounter(correlationId: string, counter: CounterV1,
        callback?: (err: any, counter: CounterV1) => void): void;
    
    writeCounters(correlationId: string, counters: CounterV1[],
        callback?: (err: any) => void): void;

    clear(correlationId: string, callback?: (err: any) => void): void;
}
