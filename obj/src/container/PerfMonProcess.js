"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_container_node_1 = require("pip-services-container-node");
const pip_services_net_node_1 = require("pip-services-net-node");
const pip_services_oss_node_1 = require("pip-services-oss-node");
const PerfMonServiceFactory_1 = require("../build/PerfMonServiceFactory");
class PerfMonProcess extends pip_services_container_node_1.ProcessContainer {
    constructor() {
        super("perfmon", "Performance counters microservice");
        this._factories.add(new PerfMonServiceFactory_1.PerfMonServiceFactory);
        this._factories.add(new pip_services_net_node_1.DefaultNetFactory);
        this._factories.add(new pip_services_oss_node_1.DefaultOssFactory);
    }
}
exports.PerfMonProcess = PerfMonProcess;
//# sourceMappingURL=PerfMonProcess.js.map