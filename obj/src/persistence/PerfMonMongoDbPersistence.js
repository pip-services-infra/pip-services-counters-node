"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_mongoose_node_1 = require("pip-services3-mongoose-node");
const PerfMonMongooseSchema_1 = require("./PerfMonMongooseSchema");
class PerfMonMongoDbPersistence extends pip_services3_mongoose_node_1.IdentifiableMongoosePersistence {
    constructor() {
        super('counters', PerfMonMongooseSchema_1.PerfMonMongooseSchema());
        this._maxPageSize = 1000;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
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
        super.set(correlationId, counter, callback);
    }
    addBatch(correlationId, counters, callback) {
        if (counters == null || counters.length == 0) {
            if (callback)
                callback(null);
            return;
        }
        let batch = this._model.collection.initializeUnorderedBulkOp();
        for (let counter of counters) {
            if (batch) {
                batch.find({ _id: counter.id }).upsert().updateOne({
                    $setOnInsert: { name: counter.name, source: counter.source, type: counter.type },
                    $set: { last: counter.last, count: counter.count, min: counter.min, max: counter.max, average: counter.average, time: counter.time }
                });
            }
        }
        if (batch) {
            batch.execute((err) => {
                // if (!err)
                //     this._logger.trace(correlationId, "Created %d data in %s", counters.length, this._collection)
            });
        }
        if (callback)
            callback(null);
    }
    deleteExpired(correlationId, expireTime, callback) {
        this.deleteByFilter(correlationId, pip_services3_commons_node_1.FilterParams.fromTuples("to_time", expireTime), callback);
    }
}
exports.PerfMonMongoDbPersistence = PerfMonMongoDbPersistence;
//# sourceMappingURL=PerfMonMongoDbPersistence.js.map