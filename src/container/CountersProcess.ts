import { IReferences } from 'pip-services-commons-node';
import { ProcessContainer } from 'pip-services-container-node';

import { CountersFactory } from '../build/CountersFactory';

export class CountersProcess extends ProcessContainer {

    protected initReferences(references: IReferences): void {
        super.initReferences(references);

        // Factory to statically resolve Counters components
        references.put(CountersFactory.Descriptor, new CountersFactory());
    }

    public runWithArguments(args: string[]): void {
        return this.runWithArgumentsOrConfigFile("counters", args, "./config/config.yaml");
    }

}
