"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_container_node_1 = require("pip-services-container-node");
const pip_services_net_node_1 = require("pip-services-net-node");
const pip_services_oss_node_1 = require("pip-services-oss-node");
const CountersServiceFactory_1 = require("../build/CountersServiceFactory");
class CountersProcess extends pip_services_container_node_1.ProcessContainer {
    constructor() {
        super("counters", "Performance counters microservice");
        this._factories.add(new CountersServiceFactory_1.CountersServiceFactory);
        this._factories.add(new pip_services_net_node_1.DefaultNetFactory);
        this._factories.add(new pip_services_oss_node_1.DefaultOssFactory);
    }
}
exports.CountersProcess = CountersProcess;
//# sourceMappingURL=CountersProcess.js.map