"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_data_node_1 = require("pip-services-data-node");
const CounterV1_1 = require("../data/version1/CounterV1");
const CountersMongoDbSchema_1 = require("./CountersMongoDbSchema");
class CountersMongoDbPersistence extends pip_services_data_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('counters', CountersMongoDbSchema_1.CountersMongoDbSchema());
        this._maxPageSize = 1000;
    }
    composeFilter(filter) {
        filter = filter || new pip_services_commons_node_1.FilterParams();
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
            let groupWithDot = group + group[group.length - 1] == "." ? "" : ".";
            groupWithDot = groupWithDot.replace(".", "\\.");
            let searchRegex = new RegExp(groupWithDot + "&", "i");
            criteria.push({ name: { $regex: searchRegex } });
        }
        let counter = filter.getAsNullableString("counter");
        if (counter != null) {
            let counterWithDot = counter + counter[0] == "." ? "" : ".";
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
    mergeCounters(oldCounter, counter) {
        // If types are different then override old value
        if (oldCounter.type != counter.type)
            return counter;
        if (counter.type == pip_services_commons_node_2.CounterType.Increment) {
            let newCounter = new CounterV1_1.CounterV1(counter.name, counter.type);
            newCounter.count = oldCounter.count + counter.count;
            return newCounter;
        }
        else if (counter.type == pip_services_commons_node_2.CounterType.Interval
            || counter.type == pip_services_commons_node_2.CounterType.Statistics) {
            let newCounter = new CounterV1_1.CounterV1(counter.name, counter.type);
            newCounter.id = oldCounter.id;
            newCounter.source = oldCounter.source;
            newCounter.time = counter.time;
            newCounter.last = counter.last;
            newCounter.count = counter.count + oldCounter.count;
            newCounter.max = Math.max(counter.max, oldCounter.max);
            newCounter.min = Math.min(counter.min, oldCounter.max);
            newCounter.average = ((counter.average * counter.count)
                + (oldCounter.average * oldCounter.count))
                / (counter.count + oldCounter.count);
            return newCounter;
        }
        else {
            return counter;
        }
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    deleteByFilter(correlationId, filter, callback) {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }
    addOne(correlationId, counter, callback) {
        if (counter == null) {
            if (callback)
                callback(null, null);
            return;
        }
        let oldCounter = null;
        async.series([
            (callback) => {
                this.getPageByFilter(correlationId, pip_services_commons_node_1.FilterParams.fromTuples("id", counter.id), null, (err, page) => {
                    oldCounter = page.data[0];
                    callback(err, oldCounter);
                });
            },
            (callback) => {
                if (oldCounter) {
                    counter = this.mergeCounters(oldCounter, counter);
                }
                super.set(correlationId, counter, callback);
            }
        ], (err, results) => {
            if (callback)
                callback(err, results[1]);
        });
    }
    addBatch(correlationId, counters, callback) {
        if (counters == null || counters.length == 0) {
            if (callback)
                callback(null);
            return;
        }
        let batch = this._model.collection.initializeUnorderedBulkOp();
        async.each(counters, (counter, callback) => {
            let oldCounter = null;
            async.series([
                (callback) => {
                    this.getPageByFilter(correlationId, pip_services_commons_node_1.FilterParams.fromTuples("id", counter.id), null, (err, page) => {
                        oldCounter = page.data[0];
                        callback(err, oldCounter);
                    });
                },
                (callback) => {
                    if (oldCounter) {
                        counter = this.mergeCounters(oldCounter, counter);
                    }
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
                    callback();
                }
            ], callback);
        }, (err) => {
            if (!err) {
                batch.execute((err) => {
                    if (!err)
                        this._logger.trace(correlationId, "Created %d data in %s", counters.length, this._collection);
                });
            }
            if (callback)
                callback(err);
        });
    }
    deleteExpired(correlationId, expireLogsTime, expireErrorsTime, callback) {
        this.deleteByFilter(correlationId, pip_services_commons_node_1.FilterParams.fromTuples("to_time", expireLogsTime), null);
        if (callback)
            callback(null);
    }
}
exports.CountersMongoDbPersistence = CountersMongoDbPersistence;
//# sourceMappingURL=CountersMongoDbPersistence.js.map