"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_net_node_1 = require("pip-services-net-node");
class CountersHttpServiceV1 extends pip_services_net_node_1.CommandableHttpService {
    constructor() {
        super('counters');
        this._dependencyResolver.put('controller', new pip_services_commons_node_1.Descriptor('pip-services-counters', 'controller', 'default', '*', '1.0'));
    }
}
exports.CountersHttpServiceV1 = CountersHttpServiceV1;
//# sourceMappingURL=CountersHttpServiceV1.js.map