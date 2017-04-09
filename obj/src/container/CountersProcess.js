"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_container_node_1 = require("pip-services-container-node");
const CountersFactory_1 = require("../build/CountersFactory");
class CountersProcess extends pip_services_container_node_1.ProcessContainer {
    initReferences(references) {
        super.initReferences(references);
        // Factory to statically resolve Counters components
        references.put(CountersFactory_1.CountersFactory.Descriptor, new CountersFactory_1.CountersFactory());
    }
    runWithArguments(args) {
        return this.runWithArgumentsOrConfigFile("counters", args, "./config/config.yaml");
    }
}
exports.CountersProcess = CountersProcess;
//# sourceMappingURL=CountersProcess.js.map