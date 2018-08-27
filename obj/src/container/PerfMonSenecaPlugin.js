"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_components_node_1 = require("pip-services-components-node");
const pip_services_seneca_node_1 = require("pip-services-seneca-node");
const pip_services_seneca_node_2 = require("pip-services-seneca-node");
const PerfMonMemoryPersistence_1 = require("../persistence/PerfMonMemoryPersistence");
const PerfMonController_1 = require("../logic/PerfMonController");
const PerfMonSenecaServiceV1_1 = require("../services/version1/PerfMonSenecaServiceV1");
class PerfMonSenecaPlugin extends pip_services_seneca_node_1.SenecaPlugin {
    constructor(seneca, options) {
        super('pip-services-perfmon', seneca, PerfMonSenecaPlugin.createReferences(seneca, options));
    }
    static createReferences(seneca, options) {
        options = options || {};
        let logger = new pip_services_components_node_1.ConsoleLogger();
        let loggerOptions = options.logger || {};
        logger.configure(pip_services_commons_node_3.ConfigParams.fromValue(loggerOptions));
        let controller = new PerfMonController_1.PerfMonController();
        let persistenceOptions = options.persistence || {};
        let persistence = new PerfMonMemoryPersistence_1.PerfMonMemoryPersistence();
        persistence.configure(pip_services_commons_node_3.ConfigParams.fromValue(persistenceOptions));
        let senecaInstance = new pip_services_seneca_node_2.SenecaInstance(seneca);
        let service = new PerfMonSenecaServiceV1_1.PerfMonSenecaServiceV1();
        let serviceOptions = options.service || {};
        service.configure(pip_services_commons_node_3.ConfigParams.fromValue(serviceOptions));
        return pip_services_commons_node_1.References.fromTuples(new pip_services_commons_node_2.Descriptor('pip-services', 'logger', 'console', 'default', '1.0'), logger, new pip_services_commons_node_2.Descriptor('pip-services-seneca', 'seneca', 'instance', 'default', '1.0'), senecaInstance, new pip_services_commons_node_2.Descriptor('pip-services-perfmon', 'persistence', 'memory', 'default', '1.0'), persistence, new pip_services_commons_node_2.Descriptor('pip-services-perfmon', 'controller', 'default', 'default', '1.0'), controller, new pip_services_commons_node_2.Descriptor('pip-services-perfmon', 'service', 'seneca', 'default', '1.0'), service);
    }
}
exports.PerfMonSenecaPlugin = PerfMonSenecaPlugin;
module.exports = function (options) {
    let seneca = this;
    let plugin = new PerfMonSenecaPlugin(seneca, options);
    return { name: plugin.name };
};
//# sourceMappingURL=PerfMonSenecaPlugin.js.map