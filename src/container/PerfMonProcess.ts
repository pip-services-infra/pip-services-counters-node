import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

import { PerfMonServiceFactory } from '../build/PerfMonServiceFactory';

export class PerfMonProcess extends ProcessContainer {

    public constructor() {
        super("perfmon", "Performance counters microservice");
        this._factories.add(new PerfMonServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
