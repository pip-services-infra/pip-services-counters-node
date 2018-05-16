"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
const pip_services_net_node_1 = require("pip-services-net-node");
const pip_services_net_node_2 = require("pip-services-net-node");
const CountersMemoryPersistence_1 = require("../persistence/CountersMemoryPersistence");
const CountersController_1 = require("../logic/CountersController");
const CountersSenecaServiceV1_1 = require("../services/version1/CountersSenecaServiceV1");
class CountersSenecaPlugin extends pip_services_net_node_1.SenecaPlugin {
    constructor(seneca, options) {
        super('pip-services-counters', seneca, CountersSenecaPlugin.createReferences(seneca, options));
    }
    static createReferences(seneca, options) {
        options = options || {};
        let logger = new pip_services_commons_node_4.ConsoleLogger();
        let loggerOptions = options.logger || {};
        logger.configure(pip_services_commons_node_3.ConfigParams.fromValue(loggerOptions));
        let controller = new CountersController_1.CountersController();
        let persistenceOptions = options.persistence || {};
        let persistence = new CountersMemoryPersistence_1.CountersMemoryPersistence();
        persistence.configure(pip_services_commons_node_3.ConfigParams.fromValue(persistenceOptions));
        let senecaInstance = new pip_services_net_node_2.SenecaInstance(seneca);
        let service = new CountersSenecaServiceV1_1.CountersSenecaServiceV1();
        let serviceOptions = options.service || {};
        service.configure(pip_services_commons_node_3.ConfigParams.fromValue(serviceOptions));
        return pip_services_commons_node_1.References.fromTuples(new pip_services_commons_node_2.Descriptor('pip-services-commons', 'logger', 'console', 'default', '1.0'), logger, new pip_services_commons_node_2.Descriptor('pip-services-net', 'seneca', 'instance', 'default', '1.0'), senecaInstance, new pip_services_commons_node_2.Descriptor('pip-services-counters', 'persistence', 'memory', 'default', '1.0'), persistence, new pip_services_commons_node_2.Descriptor('pip-services-counters', 'controller', 'default', 'default', '1.0'), controller, new pip_services_commons_node_2.Descriptor('pip-services-counters', 'service', 'seneca', 'default', '1.0'), service);
    }
}
exports.CountersSenecaPlugin = CountersSenecaPlugin;
module.exports = function (options) {
    let seneca = this;
    let plugin = new CountersSenecaPlugin(seneca, options);
    return { name: plugin.name };
};
//# sourceMappingURL=CountersSenecaPlugin.js.map