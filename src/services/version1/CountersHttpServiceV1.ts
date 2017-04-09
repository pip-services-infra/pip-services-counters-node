import { Descriptor } from 'pip-services-commons-node';
import { CommandableHttpService } from 'pip-services-net-node';

export class CountersHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('counters');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-counters', 'controller', 'default', '*', '1.0'));
    }
}