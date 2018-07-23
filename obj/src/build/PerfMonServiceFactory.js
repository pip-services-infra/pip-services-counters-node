"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const PerfMonMemoryPersistence_1 = require("../persistence/PerfMonMemoryPersistence");
const PerfMonMongoDbPersistence_1 = require("../persistence/PerfMonMongoDbPersistence");
const PerfMonController_1 = require("../logic/PerfMonController");
const PerfMonHttpServiceV1_1 = require("../services/version1/PerfMonHttpServiceV1");
const PerfMonSenecaServiceV1_1 = require("../services/version1/PerfMonSenecaServiceV1");
class PerfMonServiceFactory extends pip_services_commons_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(PerfMonServiceFactory.MemoryPersistenceDescriptor, PerfMonMemoryPersistence_1.PerfMonMemoryPersistence);
        this.registerAsType(PerfMonServiceFactory.MongoDbPersistenceDescriptor, PerfMonMongoDbPersistence_1.PerfMonMongoDbPersistence);
        this.registerAsType(PerfMonServiceFactory.ControllerDescriptor, PerfMonController_1.PerfMonController);
        this.registerAsType(PerfMonServiceFactory.SenecaServiceDescriptor, PerfMonSenecaServiceV1_1.PerfMonSenecaServiceV1);
        this.registerAsType(PerfMonServiceFactory.HttpServiceDescriptor, PerfMonHttpServiceV1_1.PerfMonHttpServiceV1);
    }
}
PerfMonServiceFactory.Descriptor = new pip_services_commons_node_2.Descriptor("pip-services-perfmon", "factory", "default", "default", "1.0");
PerfMonServiceFactory.MemoryPersistenceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-perfmon", "persistence", "memory", "*", "1.0");
PerfMonServiceFactory.MongoDbPersistenceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-perfmon", "persistence", "mongodb", "*", "1.0");
PerfMonServiceFactory.ControllerDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-perfmon", "controller", "default", "*", "1.0");
PerfMonServiceFactory.SenecaServiceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-perfmon", "service", "seneca", "*", "1.0");
PerfMonServiceFactory.HttpServiceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-perfmon", "service", "http", "*", "1.0");
exports.PerfMonServiceFactory = PerfMonServiceFactory;
//# sourceMappingURL=PerfMonServiceFactory.js.map