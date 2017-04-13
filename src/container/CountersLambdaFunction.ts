import { Descriptor } from 'pip-services-commons-node';
import { CommandableLambdaFunction } from 'pip-services-aws-node';
import { CountersFactory } from '../build/CountersFactory';

export class CountersLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("counters", "Performance counters function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-counters', 'controller', 'default', '*', '*'));
        this._factories.add(new CountersFactory());
    }
}

export const handler = new CountersLambdaFunction().getHandler();