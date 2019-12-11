"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const CountersServiceFactory_1 = require("../build/CountersServiceFactory");
class CountersProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("perfmon", "Performance counters microservice");
        this._factories.add(new CountersServiceFactory_1.CountersServiceFactory);
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.CountersProcess = CountersProcess;
//# sourceMappingURL=CountersProcess.js.map