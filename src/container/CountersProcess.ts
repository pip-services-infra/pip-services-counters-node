import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

import { CountersServiceFactory } from '../build/CountersServiceFactory';

export class CountersProcess extends ProcessContainer {

    public constructor() {
        super("perfmon", "Performance counters microservice");
        this._factories.add(new CountersServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
