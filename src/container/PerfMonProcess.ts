import { IReferences } from 'pip-services-commons-node';
import { ProcessContainer } from 'pip-services-container-node';
import { DefaultRpcFactory } from 'pip-services-rpc-node';

import { PerfMonServiceFactory } from '../build/PerfMonServiceFactory';

export class PerfMonProcess extends ProcessContainer {

    public constructor() {
        super("perfmon", "Performance counters microservice");
        this._factories.add(new PerfMonServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
