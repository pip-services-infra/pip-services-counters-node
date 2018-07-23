import { Factory } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';

import { PerfMonMemoryPersistence } from '../persistence/PerfMonMemoryPersistence';
import { PerfMonMongoDbPersistence} from '../persistence/PerfMonMongoDbPersistence';
import { PerfMonController } from '../logic/PerfMonController';
import { PerfMonHttpServiceV1 } from '../services/version1/PerfMonHttpServiceV1';
import { PerfMonSenecaServiceV1 } from '../services/version1/PerfMonSenecaServiceV1'; 

export class PerfMonServiceFactory extends Factory {
	public static Descriptor = new Descriptor("pip-services-perfmon", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("pip-services-perfmon", "persistence", "memory", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("pip-services-perfmon", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("pip-services-perfmon", "controller", "default", "*", "1.0");
	public static SenecaServiceDescriptor = new Descriptor("pip-services-perfmon", "service", "seneca", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("pip-services-perfmon", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(PerfMonServiceFactory.MemoryPersistenceDescriptor, PerfMonMemoryPersistence);
		this.registerAsType(PerfMonServiceFactory.MongoDbPersistenceDescriptor, PerfMonMongoDbPersistence);
		this.registerAsType(PerfMonServiceFactory.ControllerDescriptor, PerfMonController);
		this.registerAsType(PerfMonServiceFactory.SenecaServiceDescriptor, PerfMonSenecaServiceV1);
		this.registerAsType(PerfMonServiceFactory.HttpServiceDescriptor, PerfMonHttpServiceV1);
	}
	
}
