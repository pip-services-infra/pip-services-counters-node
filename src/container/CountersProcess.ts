import { IReferences } from 'pip-services-commons-node';
import { ProcessContainer } from 'pip-services-container-node';
import { DefaultNetFactory } from 'pip-services-net-node';
import { DefaultOssFactory } from 'pip-services-oss-node';

import { CountersServiceFactory } from '../build/CountersServiceFactory';

export class CountersProcess extends ProcessContainer {

    public constructor() {
        super("counters", "Performance counters microservice");
        this._factories.add(new CountersServiceFactory);
        this._factories.add(new DefaultNetFactory);
        this._factories.add(new DefaultOssFactory);
    }

}
