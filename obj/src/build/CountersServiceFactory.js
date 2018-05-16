"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const CountersMemoryPersistence_1 = require("../persistence/CountersMemoryPersistence");
const CountersController_1 = require("../logic/CountersController");
const CountersHttpServiceV1_1 = require("../services/version1/CountersHttpServiceV1");
const CountersSenecaServiceV1_1 = require("../services/version1/CountersSenecaServiceV1");
class CountersServiceFactory extends pip_services_commons_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(CountersServiceFactory.MemoryPersistenceDescriptor, CountersMemoryPersistence_1.CountersMemoryPersistence);
        this.registerAsType(CountersServiceFactory.ControllerDescriptor, CountersController_1.CountersController);
        this.registerAsType(CountersServiceFactory.SenecaServiceDescriptor, CountersSenecaServiceV1_1.CountersSenecaServiceV1);
        this.registerAsType(CountersServiceFactory.HttpServiceDescriptor, CountersHttpServiceV1_1.CountersHttpServiceV1);
    }
}
CountersServiceFactory.Descriptor = new pip_services_commons_node_2.Descriptor("pip-services-counters", "factory", "default", "default", "1.0");
CountersServiceFactory.MemoryPersistenceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-counters", "persistence", "memory", "*", "1.0");
CountersServiceFactory.ControllerDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-counters", "controller", "default", "*", "1.0");
CountersServiceFactory.SenecaServiceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-counters", "service", "seneca", "*", "1.0");
CountersServiceFactory.HttpServiceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-counters", "service", "http", "*", "1.0");
exports.CountersServiceFactory = CountersServiceFactory;
//# sourceMappingURL=CountersServiceFactory.js.map