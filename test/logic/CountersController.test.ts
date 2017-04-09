let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';
import { CounterType } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';

import { CounterV1 } from '../../src/data/version1/CounterV1';
import { CountersMemoryPersistence } from '../../src/persistence/CountersMemoryPersistence';
import { CountersController } from '../../src/logic/CountersController';

suite('CountersController', ()=> {
    let controller: CountersController;

    suiteSetup(() => {
        let persistence = new CountersMemoryPersistence();
        controller = new CountersController();

        let references: References = References.fromTuples(
            new Descriptor('pip-services-counters', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-counters', 'controller', 'default', 'default', '1.0'), controller
        );
        controller.setReferences(references);
    });
    
    setup((done) => {
        controller.clear(null, done);
    });
    
    test('CRUD Operations', (done) => {
         async.series([
            (callback) => {
                let counter = new CounterV1("counter1", CounterType.Statistics);
                counter.count = 1;
                counter.max = 10;
                counter.min = 1;
                counter.average = 5;

                controller.writeCounter(
                    null, 
                    counter, 
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

                controller.writeCounters(
                    null,
                    [counter1, counter2],
                    (err) => {
                        assert.isNull(err);
                        callback(err);
                    }
                );
            },
            (callback) => {
                controller.readCounters(
                    null, 
                    FilterParams.fromTuples("name", "counter1"), 
                    null,
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