"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
const pip_services_commons_node_5 = require("pip-services-commons-node");
const pip_services_commons_node_6 = require("pip-services-commons-node");
const pip_services_commons_node_7 = require("pip-services-commons-node");
const pip_services_commons_node_8 = require("pip-services-commons-node");
const pip_services_commons_node_9 = require("pip-services-commons-node");
const CounterV1Schema_1 = require("../data/version1/CounterV1Schema");
class CountersCommandSet extends pip_services_commons_node_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        this.addCommand(this.makeReadCountersCommand());
        this.addCommand(this.makeWriteCounterCommand());
        this.addCommand(this.makeWriteCountersCommand());
        this.addCommand(this.makeClearCommand());
    }
    makeReadCountersCommand() {
        return new pip_services_commons_node_2.Command("read_counters", new pip_services_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('fitler', new pip_services_commons_node_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services_commons_node_8.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.readCounters(correlationId, filter, paging, callback);
        });
    }
    makeWriteCounterCommand() {
        return new pip_services_commons_node_2.Command("write_counter", new pip_services_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('counter', new CounterV1Schema_1.CounterV1Schema()), (correlationId, args, callback) => {
            let counter = args.get("counter");
            counter.time = pip_services_commons_node_9.DateTimeConverter.toNullableDateTime(counter.time);
            this._logic.writeCounter(correlationId, counter, callback);
        });
    }
    makeWriteCountersCommand() {
        return new pip_services_commons_node_2.Command("write_counters", new pip_services_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('counters', new pip_services_commons_node_6.ArraySchema(new CounterV1Schema_1.CounterV1Schema())), (correlationId, args, callback) => {
            let counters = args.get("counters");
            _.each(counters, (c) => {
                c.time = pip_services_commons_node_9.DateTimeConverter.toNullableDateTime(c.time);
            });
            this._logic.writeCounters(correlationId, counters, callback);
        });
    }
    makeClearCommand() {
        return new pip_services_commons_node_2.Command("clear", null, (correlationId, args, callback) => {
            this._logic.clear(correlationId, callback);
        });
    }
}
exports.CountersCommandSet = CountersCommandSet;
//# sourceMappingURL=PerfMonCommandSet.js.map