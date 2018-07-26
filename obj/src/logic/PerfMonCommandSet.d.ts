import { CommandSet } from 'pip-services-commons-node';
import { IPerfMonController } from './IPerfMonController';
export declare class CountersCommandSet extends CommandSet {
    private _logic;
    constructor(logic: IPerfMonController);
    private makeReadCountersCommand();
    private makeWriteCounterCommand();
    private makeWriteCountersCommand();
    private makeClearCommand();
}
