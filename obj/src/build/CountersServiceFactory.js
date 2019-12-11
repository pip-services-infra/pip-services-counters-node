"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const CountersMemoryPersistence_1 = require("../persistence/CountersMemoryPersistence");
const CountersMongoDbPersistence_1 = require("../persistence/CountersMongoDbPersistence");
const CountersController_1 = require("../logic/CountersController");
const CountersHttpServiceV1_1 = require("../services/version1/CountersHttpServiceV1");
class CountersServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(CountersServiceFactory.MemoryPersistenceDescriptor, CountersMemoryPersistence_1.CountersMemoryPersistence);
        this.registerAsType(CountersServiceFactory.MongoDbPersistenceDescriptor, CountersMongoDbPersistence_1.CountersMongoDbPersistence);
        this.registerAsType(CountersServiceFactory.ControllerDescriptor, CountersController_1.CountersController);
        this.registerAsType(CountersServiceFactory.HttpServiceDescriptor, CountersHttpServiceV1_1.CountersHttpServiceV1);
    }
}
exports.CountersServiceFactory = CountersServiceFactory;
CountersServiceFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services-counters", "factory", "default", "default", "1.0");
CountersServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-counters", "persistence", "memory", "*", "1.0");
CountersServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-counters", "persistence", "mongodb", "*", "1.0");
CountersServiceFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-counters", "controller", "default", "*", "1.0");
CountersServiceFactory.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-counters", "service", "http", "*", "1.0");
//# sourceMappingURL=CountersServiceFactory.js.map