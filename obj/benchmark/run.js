"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let process = require('process');
let async = require('async');
const pip_benchmark_node_1 = require("pip-benchmark-node");
const pip_benchmark_node_2 = require("pip-benchmark-node");
const pip_benchmark_node_3 = require("pip-benchmark-node");
const pip_benchmark_node_4 = require("pip-benchmark-node");
const PerfMonBenchmarkSuite_1 = require("./PerfMonBenchmarkSuite");
let runner = new pip_benchmark_node_1.BenchmarkRunner();
pip_benchmark_node_2.ConsoleEventPrinter.attach(runner);
runner.benchmarks.addSuite(new PerfMonBenchmarkSuite_1.PerfMonBenchmarkSuite);
runner.parameters.set({
    'PerfMon.InitialRecordNumber': 0,
    'PerfMon.SourceQuantity': 10,
    'PerfMon.MongoUri': process.env['MONGO_URI'],
    'PerfMon.MongoHost': process.env['MONGO_HOST'] || 'localhost',
    'PerfMon.MongoPort': process.env['MONGO_PORT'] || 27017,
    'PerfMon.MongoDb': process.env['MONGO_DB'] || 'benchmark'
});
runner.configuration.measurementType = pip_benchmark_node_3.MeasurementType.Peak;
runner.configuration.executionType = pip_benchmark_node_4.ExecutionType.Sequential;
runner.configuration.duration = 10;
runner.benchmarks.selectByName(['PerfMon.AddMongoDbPerfMon']);
runner.run((err) => {
    if (err)
        console.error(err);
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
//# sourceMappingURL=run.js.map