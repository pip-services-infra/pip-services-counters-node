import { References } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { ConfigParams } from 'pip-services-commons-node';
import { ConsoleLogger } from 'pip-services-commons-node';
import { ConfigException } from 'pip-services-commons-node';
import { SenecaPlugin } from 'pip-services-net-node';
import { SenecaInstance } from 'pip-services-net-node';

import { CountersMemoryPersistence } from '../persistence/CountersMemoryPersistence';
import { CountersController } from '../logic/CountersController';
import { CountersSenecaServiceV1 } from '../services/version1/CountersSenecaServiceV1';

export class CountersSenecaPlugin extends SenecaPlugin {
    public constructor(seneca: any, options: any) {
        super('pip-services-counters', seneca, CountersSenecaPlugin.createReferences(seneca, options));
    }

    private static createReferences(seneca: any, options: any): References {
        options = options || {};

        let logger = new ConsoleLogger();
        let loggerOptions = options.logger || {};
        logger.configure(ConfigParams.fromValue(loggerOptions));

        let controller = new CountersController();

        let persistenceOptions = options.persistence || {};
        let persistence = new CountersMemoryPersistence();
        persistence.configure(ConfigParams.fromValue(persistenceOptions));

        let senecaInstance = new SenecaInstance(seneca);

        let service = new CountersSenecaServiceV1();
        let serviceOptions = options.service || {};
        service.configure(ConfigParams.fromValue(serviceOptions));

        return References.fromTuples(
            new Descriptor('pip-services-commons', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services-net', 'seneca', 'instance', 'default', '1.0'), senecaInstance,
            new Descriptor('pip-services-counters', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-counters', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-counters', 'service', 'seneca', 'default', '1.0'), service
        );
    }
}

module.exports = function(options: any): any {
    let seneca = this;
    let plugin = new CountersSenecaPlugin(seneca, options);
    return { name: plugin.name };
}