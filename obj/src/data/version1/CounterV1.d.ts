import { CounterType } from 'pip-services-commons-node';
export declare class CounterV1 {
    constructor(name: string, type: CounterType);
    name: string;
    type: CounterType;
    last: number;
    count: number;
    min: number;
    max: number;
    average: number;
    time: Date;
}
