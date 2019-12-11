let _ = require('lodash');
let process = require('process');
let async = require('async');

import { BenchmarkRunner } from 'pip-benchmark-node';
import { ConsoleEventPrinter } from 'pip-benchmark-node';
import { MeasurementType } from 'pip-benchmark-node';
import { ExecutionType } from 'pip-benchmark-node';
import { CountersBenchmarkSuite } from './CountersBenchmarkSuite';

let runner = new BenchmarkRunner();

ConsoleEventPrinter.attach(runner);

runner.benchmarks.addSuite(new CountersBenchmarkSuite);

runner.parameters.set({
    'Counters.InitialRecordNumber': 0,
    'Counters.SourceQuantity': 10,
    'Counters.MongoUri': process.env['MONGO_URI'],
    'Counters.MongoHost': process.env['MONGO_HOST'] || 'localhost',
    'Counters.MongoPort': process.env['MONGO_PORT'] || 27017,
    'Counters.MongoDb': process.env['MONGO_DB'] || 'benchmark'
});

runner.configuration.measurementType = MeasurementType.Peak;
runner.configuration.executionType = ExecutionType.Sequential;
runner.configuration.duration = 10;

runner.benchmarks.selectByName(['Counters.AddMongoDbCounters']);

runner.run((err: any) => {
    if (err) console.error(err);
});

// Log uncaught exceptions
process.on('uncaughtException', (ex) => {
    console.error(ex);
    console.error("Process is terminated");
    process.exit(1);
});

// Gracefully shutdown
process.on('exit', function () {
    runner.stop();
    //console.log("Goodbye!");
});
