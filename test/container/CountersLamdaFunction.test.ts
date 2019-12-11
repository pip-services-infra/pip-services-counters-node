let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';
import { CounterType } from 'pip-services3-components-node';
import { FilterParams } from 'pip-services3-commons-node';

import { CounterV1 } from '../../src/data/version1/CounterV1';
import { CountersMemoryPersistence } from '../../src/persistence/CountersMemoryPersistence';
import { CountersController } from '../../src/logic/CountersController';
import { CountersLambdaFunction } from '../../src/container/CountersLambdaFunction';


suite('CountersLambdaFunction', ()=> {
    let lambda: CountersLambdaFunction;

    suiteSetup((done) => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'pip-services-counters:persistence:memory:default:1.0',
            'controller.descriptor', 'pip-services-counters:controller:default:default:1.0'
        );

        lambda = new CountersLambdaFunction();
        lambda.configure(config);
        lambda.open(null, done);
    });
    
    suiteTeardown((done) => {
        lambda.close(null, done);
    });
    
    test('CRUD Operations', (done) => {
         async.series([
            (callback) => {
                let counter = new CounterV1("counter1", CounterType.Statistics);
                counter.count = 1;
                counter.max = 10;
                counter.min = 1;
                counter.average = 5;

                lambda.act(
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

                lambda.act(
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
                lambda.act(
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