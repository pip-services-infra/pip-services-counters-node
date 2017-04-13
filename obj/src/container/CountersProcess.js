"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_container_node_1 = require("pip-services-container-node");
const CountersFactory_1 = require("../build/CountersFactory");
class CountersProcess extends pip_services_container_node_1.ProcessContainer {
    constructor() {
        super("counters", "Performance counters microservice");
        this._factories.add(new CountersFactory_1.CountersFactory);
    }
}
exports.CountersProcess = CountersProcess;
//# sourceMappingURL=CountersProcess.js.map