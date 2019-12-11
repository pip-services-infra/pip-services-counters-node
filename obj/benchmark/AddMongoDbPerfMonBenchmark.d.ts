import { Benchmark } from 'pip-benchmark-node';
export declare class AddMongoDbPerfMonBenchmark extends Benchmark {
    private _initialRecordNumber;
    private _sourceQuantity;
    private _startTime;
    private _interval;
    private _source;
    private _time;
    private _persistence;
    private _controller;
    constructor();
    setUp(callback: (err: any) => void): void;
    tearDown(callback: (err: any) => void): void;
    private getRandomString;
    private getRandomInteger;
    execute(callback: (err: any) => void): void;
}
