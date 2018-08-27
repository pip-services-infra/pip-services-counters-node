"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_seneca_node_1 = require("pip-services-seneca-node");
class PerfMonSenecaServiceV1 extends pip_services_seneca_node_1.CommandableSenecaService {
    constructor() {
        super('perfmon');
        this._dependencyResolver.put('controller', new pip_services_commons_node_1.Descriptor('pip-services-perfmon', 'controller', 'default', '*', '1.0'));
    }
}
exports.PerfMonSenecaServiceV1 = PerfMonSenecaServiceV1;
//# sourceMappingURL=PerfMonSenecaServiceV1.js.map