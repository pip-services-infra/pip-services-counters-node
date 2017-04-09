"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
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
        return new pip_services_commons_node_2.Command("read_counters", null, (correlationId, args, callback) => {
            let filter = pip_services_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.readCounters(correlationId, filter, paging, callback);
        });
    }
    makeWriteCounterCommand() {
        return new pip_services_commons_node_2.Command("write_counter", null, (correlationId, args, callback) => {
            let counter = args.get("counter");
            this._logic.writeCounter(correlationId, counter, callback);
        });
    }
    makeWriteCountersCommand() {
        return new pip_services_commons_node_2.Command("write_counters", null, (correlationId, args, callback) => {
            let counters = args.get("counters");
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
//# sourceMappingURL=CountersCommandSet.js.map