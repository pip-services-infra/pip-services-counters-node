import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ICleanable } from 'pip-services3-commons-node';

import { CounterV1 } from '../data/version1/CounterV1';

export interface IPerfMonPersistence extends ICleanable {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<CounterV1>) => void): void;

    addOne(correlationId: string, counter: CounterV1,
        callback?: (err: any, counter: CounterV1) => void): void;

    addBatch(correlationId: string, counters: CounterV1[],
        callback: (err: any) => void): void;

    clear(correlationId: string, callback?: (err: any) => void): void;

    deleteExpired(correlationId: string, expireTime: Date, callback: (err: any) => void): void;
}
