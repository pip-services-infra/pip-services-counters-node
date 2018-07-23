let async = require('async');

import { ConfigParams } from 'pip-services-commons-node';
import { IConfigurable } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { CounterType } from 'pip-services-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services-data-node';


import { CounterV1 } from '../data/version1/CounterV1';
import { ICountersPersistence } from './ICountersPersistence';
import { CountersMongoDbSchema } from './CountersMongoDbSchema';

export class CountersMongoDbPersistence extends IdentifiableMongoDbPersistence<CounterV1, string> implements ICountersPersistence {

    constructor() {
        super('counters', CountersMongoDbSchema());
        this._maxPageSize = 1000;
    }

    private composeFilter(filter: any) {
        filter = filter || new FilterParams();

        let criteria = [];

        let search = filter.getAsNullableString("search");
        if (search != null) {
            let searchRegex = new RegExp(search, "i");
            let searchCriteria = [];

            searchCriteria.push({ name: { $regex: searchRegex } });
            searchCriteria.push({ source: { $regex: searchRegex } });
            searchCriteria.push({ id: { $regex: searchRegex } });

            criteria.push({ $or: searchCriteria });
        }

        let id = filter.getAsNullableString("id");
        if (id != null)
            criteria.push({ _id: id });

        let type = filter.getAsNullableInteger("type");
        if (type != null)
            criteria.push({ type: type });

        let name = filter.getAsNullableString("name");
        if (name != null)
            criteria.push({ name: name });

        let name_starts = filter.getAsNullableString("name_starts");
        if (name_starts != null) {
            name_starts = name_starts.replace(".", "\\.");
            let searchRegex = new RegExp("^" + name_starts, "i");
            criteria.push({ name: { $regex: searchRegex } });
        }

        let name_ends = filter.getAsNullableString("name_ends");
        if (name_ends != null) {
            name_ends = name_ends.replace(".", "\\.");
            let searchRegex = new RegExp(name_ends + "&", "i");
            criteria.push({ name: { $regex: searchRegex } });
        }

        let group = filter.getAsNullableString("group");
        if (group != null) {
            let groupWithDot = group + group[group.length - 1] == "." ? "" : "."
            groupWithDot = groupWithDot.replace(".", "\\.");
            let searchRegex = new RegExp(groupWithDot + "&", "i");
            criteria.push({ name: { $regex: searchRegex } });
        }

        let counter = filter.getAsNullableString("counter");
        if (counter != null) {
            let counterWithDot = counter + counter[0] == "." ? "" : "."
            counterWithDot = counterWithDot.replace(".", "\\.");
            let searchRegex = new RegExp("^" + counterWithDot, "i");
            criteria.push({ name: { $regex: searchRegex } });
        }

        let fromTime = filter.getAsNullableDateTime("from_time");
        if (fromTime != null)
            criteria.push({ time: { $gte: fromTime } });

        let toTime = filter.getAsNullableDateTime("to_time");
        if (toTime != null)
            criteria.push({ time: { $lt: toTime } });

        return criteria.length > 0 ? { $and: criteria } : null;
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<CounterV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter),
            paging, null, null, callback);
    }

    public deleteByFilter(correlationId: string, filter: FilterParams,
        callback: (err: any) => void): void {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }

    addOne(correlationId: string, counter: CounterV1,
        callback?: (err: any, counter: CounterV1) => void): void {

        if (counter == null) {
            if (callback) callback(null, null);
            return;
        }

        super.set(correlationId, counter, callback);

    }

    public addBatch(correlationId: string, counters: CounterV1[],
        callback: (err: any) => void): void {
        if (counters == null || counters.length == 0) {
            if (callback) callback(null);
            return;
        }

        let batch = this._model.collection.initializeUnorderedBulkOp();

        for (let counter of counters) {
            batch.find({ _id: counter.id }).upsert().replaceOne({
                _id: counter.id,
                name: counter.name,
                source: counter.source,
                type: counter.type,
                last: counter.last,
                count: counter.count,
                min: counter.min,
                max: counter.max,
                average: counter.average,
                time: counter.time
            });
        }

        batch.execute((err) => {
            if (!err)
                this._logger.trace(correlationId, "Created %d data in %s", counters.length, this._collection)
        });

        if (callback) callback(null);
    }

    public deleteExpired(correlationId: string, expireTime: Date, callback: (err: any) => void): void {
        this.deleteByFilter(correlationId, FilterParams.fromTuples("to_time", expireTime), callback);
    }
}