import { Schema } from 'mongoose';
import { CounterType } from 'pip-services3-components-node';

export let PerfMonMongoDbSchema = function(collection?: string) {
    collection = collection || 'logs';

    let PerfMonSchema = new Schema(
        {
            _id: { type: String },
            name: { type: String, required: true, index: true },
            source: { type: String, required: true, index: true },
            type: { type: CounterType, required: true, index: true },
            last: { type: Number, required: false},
            count: { type: Number, required: false},
            min: { type: Number, required: false},
            max: { type: Number, required: false},
            average: { type: Number, required: false},
            time: { type: Date, required: false }
        },
        {
            collection: collection,
            autoIndex: true
        }
    );

    PerfMonSchema.set('toJSON', {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });

    PerfMonSchema.index({ name: 1, source: 1, type: 1, time: -1 });

    return PerfMonSchema;
}
