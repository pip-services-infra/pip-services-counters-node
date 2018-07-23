let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { CounterType } from 'pip-services-commons-node';

import { CounterV1 } from '../../../src/data/version1/CounterV1';
import { PerfMonMemoryPersistence } from '../../../src/persistence/PerfMonMemoryPersistence';
import { PerfMonController } from '../../../src/logic/PerfMonController';
import { PerfMonHttpServiceV1 } from '../../../src/services/version1/PerfMonHttpServiceV1';

let restConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

suite('PerfMonHttpServiceV1', ()=> {
    let service: PerfMonHttpServiceV1;

    let rest: any;

    suiteSetup((done) => {
        let persistence = new PerfMonMemoryPersistence();
        let controller = new PerfMonController();

        service = new PerfMonHttpServiceV1();
        service.configure(restConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-perfmon', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-perfmon', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-perfmon', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });

    test('CRUD Operations', (done) => {
         async.series([
            (callback) => {
                let counter = new CounterV1("counter1", CounterType.Statistics);
                counter.count = 1;
                counter.max = 10;
                counter.min = 1;
                counter.average = 5;

                rest.post('/v1/perfmon/write_counter',
                    {
                        counter: counter
                    },
                    (err, req, res, counter) => {
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

                rest.post('/v1/perfmon/write_counters',
                    {
                        counters: [counter1, counter2]
                    },
                    (err, req, res) => {
                        assert.isNull(err);
                        callback(err);
                    }
                );
            },
            (callback) => {
                rest.post('/v1/perfmon/read_counters',
                    {
                        filter: FilterParams.fromTuples("name", "counter1")
                    }, 
                    (err, req, res, page) => {
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