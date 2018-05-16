import { CommandSet } from 'pip-services-commons-node';
import { ICountersController } from './ICountersController';
export declare class CountersCommandSet extends CommandSet {
    private _logic;
    constructor(logic: ICountersController);
    private makeReadCountersCommand();
    private makeWriteCounterCommand();
    private makeWriteCountersCommand();
    private makeClearCommand();
}
