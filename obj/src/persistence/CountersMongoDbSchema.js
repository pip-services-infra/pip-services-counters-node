"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pip_services_commons_node_1 = require("pip-services-commons-node");
exports.CountersMongoDbSchema = function (collection) {
    collection = collection || 'logs';
    let CountersSchema = new mongoose_1.Schema({
        _id: { type: String },
        name: { type: String, required: true, index: true },
        source: { type: String, required: true, index: true },
        type: { type: pip_services_commons_node_1.CounterType, required: true, index: true },
        last: { type: Number, required: false },
        count: { type: Number, required: false },
        min: { type: Number, required: false },
        max: { type: Number, required: false },
        average: { type: Number, required: false },
        time: { type: Date, required: false }
    }, {
        collection: collection,
        autoIndex: true
    });
    CountersSchema.set('toJSON', {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });
    CountersSchema.index({ name: 1, source: 1, type: 1, time: -1 });
    return CountersSchema;
};
//# sourceMappingURL=CountersMongoDbSchema.js.map