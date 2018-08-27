let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services-commons-node';
import { ConfigParams } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';
import { ConsoleLogger } from 'pip-services-components-node';
import { FilterParams } from 'pip-services-commons-node';
import { CounterType } from 'pip-services-components-node';
import { SenecaInstance } from 'pip-services-seneca-node';

import { CounterV1 } from '../../../src/data/version1/CounterV1';
import { PerfMonMemoryPersistence } from '../../../src/persistence/PerfMonMemoryPersistence';
import { PerfMonController } from '../../../src/logic/PerfMonController';
import { PerfMonSenecaServiceV1 } from '../../../src/services/version1/PerfMonSenecaServiceV1';


suite('PerfMonSenecaServiceV1', ()=> {
    let seneca: any;
    let service: PerfMonSenecaServiceV1;
    let persistence: PerfMonMemoryPersistence;
    let controller: PerfMonController;

    suiteSetup((done) => {
        persistence = new PerfMonMemoryPersistence();
        controller = new PerfMonController();

        service = new PerfMonSenecaServiceV1();
        service.configure(ConfigParams.fromTuples(
            "connection.protocol", "none"
        ));

        let logger = new ConsoleLogger();
        let senecaAddon = new SenecaInstance();

        let references: References = References.fromTuples(
            new Descriptor('pip-services', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services-seneca', 'seneca', 'instance', 'default', '1.0'), senecaAddon,
            new Descriptor('pip-services-perfmon', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-perfmon', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-perfmon', 'service', 'commandable-seneca', 'default', '1.0'), service
        );

        controller.setReferences(references);
        service.setReferences(references);

        seneca = senecaAddon.getInstance();

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });
    
    setup((done) => {
        persistence.clear(null, done);
    });
    
    test('CRUD Operations', (done) => {
         async.series([
            (callback) => {
                let counter = new CounterV1("counter1", CounterType.Statistics);
                counter.count = 1;
                counter.max = 10;
                counter.min = 1;
                counter.average = 5;

                seneca.act(
                    {
                        role: 'perfmon',
                        cmd: 'write_counter',
                        counter: counter
                    },
                    (err, counter) => {
                        assert.isNull(err);
                        assert.isObject(counter);
                        callback(err);
                    }
                );
            },
            (callback) => {
                let counter1 = new CounterV1("counter1", CounterType.Statistics);
                counter1.count = 2;
                counter1.max = 7;
                counter1.min = 0;
                counter1.average = 5;

                let counter2 = new CounterV1("counter2", CounterType.Statistics);
                counter2.count = 1;

                seneca.act(
                    {
                        role: 'perfmon',
                        cmd: 'write_counters',
                        counters: [counter1, counter2]
                    },
                    (err) => {
                        assert.isNull(err);
                        callback(err);
                    }
                );
            },
            (callback) => {
                seneca.act(
                    {
                        role: 'perfmon',
                        cmd: 'read_counters',
                        filter: FilterParams.fromTuples("name", "counter1")
                    }, 
                    (err, page) => {
                        assert.lengthOf(page.data, 1);

                        let counter = page.data[0];
                        assert.equal(3, counter.count);
                        assert.equal(0, counter.min);
                        assert.equal(10, counter.max);
                        assert.equal(5, counter.average);

                        callback(err);
                    }
                );
            }
        ], done);
    });
});