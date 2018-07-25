let _ = require('lodash');
let process = require('process');
let async = require('async');

import { BenchmarkRunner } from 'pip-benchmark-node';
import { ConsoleEventPrinter } from 'pip-benchmark-node';
import { MeasurementType } from 'pip-benchmark-node';
import { ExecutionType } from 'pip-benchmark-node';
import { PerfMonBenchmarkSuite } from './PerfMonBenchmarkSuite';

let runner = new BenchmarkRunner();

ConsoleEventPrinter.attach(runner);

runner.benchmarks.addSuite(new PerfMonBenchmarkSuite);

runner.parameters.set({
    'PerfMon.InitialRecordNumber': 0,
    'PerfMon.SourceQuantity': 10,
    'PerfMon.MongoUri': process.env['MONGO_URI'],
    'PerfMon.MongoHost': process.env['MONGO_HOST'] || 'localhost',
    'PerfMon.MongoPort': process.env['MONGO_PORT'] || 27017,
    'PerfMon.MongoDb': process.env['MONGO_DB'] || 'benchmark'
});

runner.configuration.measurementType = MeasurementType.Peak;
runner.configuration.executionType = ExecutionType.Sequential;
runner.configuration.duration = 10;

runner.benchmarks.selectByName(['PerfMon.AddMongoDbCounters']);

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
