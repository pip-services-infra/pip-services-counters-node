let async = require('async');

import { ConfigParams } from 'pip-services-commons-node';
import { IConfigurable } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { CounterType } from 'pip-services-commons-node';

import { CounterV1 } from '../data/version1/CounterV1';
import { IPerfMonPersistence } from './IPerfMonPersistence';

export class PerfMonMemoryPersistence implements IPerfMonPersistence, IConfigurable {
    private _maxPageSize: number = 100;

    private _counters: { [index: string]: CounterV1 } = {};

    public constructor() { }

    public configure(config: ConfigParams): void {
        this._maxPageSize = config.getAsIntegerWithDefault('options.max_page_size', this._maxPageSize);
    }

    private matchString(value: string, search: string): boolean {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }

    private counterContains(counter: CounterV1, search: string): boolean {
        search = search.toLowerCase();

        if (this.matchString(counter.name, search))
            return true;

        if (this.matchString(counter.source, search))
            return true;

        return false;
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<CounterV1>) => void): void {

        filter = filter || new FilterParams();
        let search = filter.getAsNullableString("search");
        let type = filter.getAsNullableInteger("type");
        let name = filter.getAsNullableString("name");
        let nameStarts = filter.getAsNullableString("name_starts");
        let nameEnds = filter.getAsNullableString("name_ends");
        let groupName = filter.getAsNullableString("group");
        if (groupName != null && !groupName.endsWith("."))
            groupName = groupName + ".";
        let counterName = filter.getAsNullableString("counter");
        if (counterName != null && !counterName.startsWith("."))
            counterName = "." + counterName;

        paging = paging || new PagingParams();
        let skip = paging.getSkip(0);
        let take = paging.getTake(this._maxPageSize);
        let data: CounterV1[] = [];

        let counters = this._counters;
        for (let prop in this._counters) {
            let counter = counters[prop];
            if (search != null && !this.counterContains(counter, search))
                continue;
            if (type != null && type != counter.type)
                continue;
            if (name != null && name != counter.name)
                continue;
            if (nameStarts != null && !counter.name.startsWith(nameStarts))
                continue;
            if (nameEnds != null && !counter.name.endsWith(nameEnds))
                continue;
            if (groupName != null && !counter.name.startsWith(groupName))
                continue;
            if (counterName != null && !counter.name.endsWith(counterName))
                continue;

            skip--;
            if (skip >= 0) continue;

            data.push(counter);

            take--;
            if (take <= 0) break;
        }

        let total = data.length;
        let page = new DataPage<CounterV1>(data, total);

        callback(null, page);
    }

    private mergeCounters(oldCounter: CounterV1, counter: CounterV1): CounterV1 {
        // If types are different then override old value
        if (oldCounter.type != counter.type)
            return counter;

        if (counter.type == CounterType.Increment) {
            let newCounter = new CounterV1(counter.name, counter.type);
            newCounter.count = oldCounter.count + counter.count;
            return newCounter;
        } else if (counter.type == CounterType.Interval
            || counter.type == CounterType.Statistics) {

            let newCounter = new CounterV1(counter.name, counter.type);

            newCounter.last = counter.last;
            newCounter.count = counter.count + oldCounter.count;
            newCounter.max = Math.max(counter.max, oldCounter.max);
            newCounter.min = Math.min(counter.min, oldCounter.max);
            newCounter.average = ((counter.average * counter.count)
                + (oldCounter.average * oldCounter.count))
                / (counter.count + oldCounter.count);

            return newCounter;
        } else {
            return counter;
        }
    }

    public addOne(correlationId: string, counter: CounterV1,
        callback?: (err: any, counter: CounterV1) => void): void {

        if (counter == null) {
            if (callback) callback(null, null);
            return;
        }

        let oldCounter = this._counters[counter.name];
        if (oldCounter)
            counter = this.mergeCounters(oldCounter, counter);

        this._counters[counter.name] = counter;

        if (callback) callback(null, counter);
    }

    public addBatch(correlationId: string, counters: CounterV1[],
        callback: (err: any) => void): void {

        async.each(counters, (c, callback) => {
            this.addOne(correlationId, c, callback);
        }, callback);
    }

    public clear(correlationId: string, callback?: (err: any) => void): void {
        this._counters = {};

        if (callback) callback(null);
    }

    public deleteExpired(correlationId: string, expireTime: Date, callback: (err: any) => void): void {
        this._counters = _.filter(this._counters, d => d.time.getTime() > expireTime.getTime());

        if (callback) callback(null);
    }

}