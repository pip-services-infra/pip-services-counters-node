"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const CountersMemoryPersistence_1 = require("../persistence/CountersMemoryPersistence");
const CountersController_1 = require("../logic/CountersController");
const CountersHttpServiceV1_1 = require("../services/version1/CountersHttpServiceV1");
const CountersSenecaServiceV1_1 = require("../services/version1/CountersSenecaServiceV1");
class CountersFactory extends pip_services_commons_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(CountersFactory.MemoryPersistenceDescriptor, CountersMemoryPersistence_1.CountersMemoryPersistence);
        this.registerAsType(CountersFactory.ControllerDescriptor, CountersController_1.CountersController);
        this.registerAsType(CountersFactory.SenecaServiceDescriptor, CountersSenecaServiceV1_1.CountersSenecaServiceV1);
        this.registerAsType(CountersFactory.HttpServiceDescriptor, CountersHttpServiceV1_1.CountersHttpServiceV1);
    }
}
CountersFactory.Descriptor = new pip_services_commons_node_2.Descriptor("pip-services-counters", "factory", "default", "default", "1.0");
CountersFactory.MemoryPersistenceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-counters", "persistence", "memory", "*", "1.0");
CountersFactory.ControllerDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-counters", "controller", "default", "*", "1.0");
CountersFactory.SenecaServiceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-counters", "service", "seneca", "*", "1.0");
CountersFactory.HttpServiceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-counters", "service", "http", "*", "1.0");
exports.CountersFactory = CountersFactory;
//# sourceMappingURL=CountersFactory.js.map