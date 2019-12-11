import { CounterType } from 'pip-services3-components-node';

export class CounterV1 {
    public constructor(name?: string, type?: CounterType) {
        this.name = name;
        this.type = type;
    }

    public id: string
    public name: string;
    public source: string;
    public type: CounterType;
    public last: number;
    public count: number;
    public min: number;
    public max: number;
    public average: number;
    public time: Date;
}