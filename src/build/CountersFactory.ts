import { Factory } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';

import { CountersMemoryPersistence } from '../persistence/CountersMemoryPersistence';
import { CountersController } from '../logic/CountersController';
import { CountersHttpServiceV1 } from '../services/version1/CountersHttpServiceV1';
import { CountersSenecaServiceV1 } from '../services/version1/CountersSenecaServiceV1'; 

export class CountersFactory extends Factory {
	public static Descriptor = new Descriptor("pip-services-counters", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("pip-services-counters", "persistence", "memory", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("pip-services-counters", "controller", "default", "*", "1.0");
	public static SenecaServiceDescriptor = new Descriptor("pip-services-counters", "service", "seneca", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("pip-services-counters", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(CountersFactory.MemoryPersistenceDescriptor, CountersMemoryPersistence);
		this.registerAsType(CountersFactory.ControllerDescriptor, CountersController);
		this.registerAsType(CountersFactory.SenecaServiceDescriptor, CountersSenecaServiceV1);
		this.registerAsType(CountersFactory.HttpServiceDescriptor, CountersHttpServiceV1);
	}
	
}
