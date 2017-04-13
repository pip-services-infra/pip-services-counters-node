import { IReferences } from 'pip-services-commons-node';
import { ProcessContainer } from 'pip-services-container-node';

import { CountersFactory } from '../build/CountersFactory';

export class CountersProcess extends ProcessContainer {

    public constructor() {
        super("counters", "Performance counters microservice");
        this._factories.add(new CountersFactory);
    }

}
