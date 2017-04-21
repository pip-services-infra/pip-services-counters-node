import { IReferences } from 'pip-services-commons-node';
import { ProcessContainer } from 'pip-services-container-node';

import { CountersServiceFactory } from '../build/CountersServiceFactory';

export class CountersProcess extends ProcessContainer {

    public constructor() {
        super("counters", "Performance counters microservice");
        this._factories.add(new CountersServiceFactory);
    }

}
