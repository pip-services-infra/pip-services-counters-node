import { CommandSet } from 'pip-services-commons-node';
import { ICountersBusinessLogic } from './ICountersBusinessLogic';
export declare class CountersCommandSet extends CommandSet {
    private _logic;
    constructor(logic: ICountersBusinessLogic);
    private makeReadCountersCommand();
    private makeWriteCounterCommand();
    private makeWriteCountersCommand();
    private makeClearCommand();
}
