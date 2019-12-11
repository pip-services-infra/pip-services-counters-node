"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class CountersHttpServiceV1 extends pip_services3_rpc_node_1.CommandableHttpService {
    constructor() {
        super('v1/perfmon');
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('pip-services-counters', 'controller', 'default', '*', '1.0'));
    }
}
exports.CountersHttpServiceV1 = CountersHttpServiceV1;
//# sourceMappingURL=CountersHttpServiceV1.js.map