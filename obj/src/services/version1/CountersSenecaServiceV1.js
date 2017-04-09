"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_net_node_1 = require("pip-services-net-node");
class CountersSenecaServiceV1 extends pip_services_net_node_1.CommandableSenecaService {
    constructor() {
        super('counters');
        this._dependencyResolver.put('controller', new pip_services_commons_node_1.Descriptor('pip-services-counters', 'controller', 'default', '*', '1.0'));
    }
}
exports.CountersSenecaServiceV1 = CountersSenecaServiceV1;
//# sourceMappingURL=CountersSenecaServiceV1.js.map