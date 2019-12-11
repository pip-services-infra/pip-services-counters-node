import { Descriptor } from 'pip-services3-commons-node';
import { CommandableLambdaFunction } from 'pip-services3-aws-node';
import { CountersServiceFactory } from '../build/CountersServiceFactory';

export class CountersLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("perfmon", "Performance counters function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-counters', 'controller', 'default', '*', '*'));
        this._factories.add(new CountersServiceFactory());
    }
}

export const handler = new CountersLambdaFunction().getHandler();