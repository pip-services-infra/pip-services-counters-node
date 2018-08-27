import { Descriptor } from 'pip-services-commons-node';
import { CommandableSenecaService } from 'pip-services-seneca-node';

export class PerfMonSenecaServiceV1 extends CommandableSenecaService {
    public constructor() {
        super('perfmon');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-perfmon', 'controller', 'default', '*', '1.0'));
    }
}