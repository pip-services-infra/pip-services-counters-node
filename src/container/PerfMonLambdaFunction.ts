import { Descriptor } from 'pip-services-commons-node';
import { CommandableLambdaFunction } from 'pip-services-aws-node';
import { PerfMonServiceFactory } from '../build/PerfMonServiceFactory';

export class PerfMonLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("perfmon", "Performance counters function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-perfmon', 'controller', 'default', '*', '*'));
        this._factories.add(new PerfMonServiceFactory());
    }
}

export const handler = new PerfMonLambdaFunction().getHandler();