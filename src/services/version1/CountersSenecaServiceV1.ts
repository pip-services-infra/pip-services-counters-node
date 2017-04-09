import { Descriptor } from 'pip-services-commons-node';
import { CommandableSenecaService } from 'pip-services-net-node';

export class CountersSenecaServiceV1 extends CommandableSenecaService {
    public constructor() {
        super('counters');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-counters', 'controller', 'default', '*', '1.0'));
    }
}