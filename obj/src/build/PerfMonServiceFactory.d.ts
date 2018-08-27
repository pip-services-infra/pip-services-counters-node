import { Factory } from 'pip-services-components-node';
import { Descriptor } from 'pip-services-commons-node';
export declare class PerfMonServiceFactory extends Factory {
    static Descriptor: Descriptor;
    static MemoryPersistenceDescriptor: Descriptor;
    static MongoDbPersistenceDescriptor: Descriptor;
    static ControllerDescriptor: Descriptor;
    static SenecaServiceDescriptor: Descriptor;
    static HttpServiceDescriptor: Descriptor;
    constructor();
}
