import { CommandSet } from 'pip-services-commons-node';
import { ICommand } from 'pip-services-commons-node';
import { Command } from 'pip-services-commons-node';
import { Schema } from 'pip-services-commons-node';
import { Parameters } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';

import { CounterV1 } from '../data/version1/CounterV1';
import { ICountersBusinessLogic } from './ICountersBusinessLogic';

export class CountersCommandSet extends CommandSet {
	private _logic: ICountersBusinessLogic;

	constructor(logic: ICountersBusinessLogic) {
		super();

		this._logic = logic;

		this.addCommand(this.makeReadCountersCommand());
		this.addCommand(this.makeWriteCounterCommand());
		this.addCommand(this.makeWriteCountersCommand());
		this.addCommand(this.makeClearCommand());
	}

	private makeReadCountersCommand(): ICommand {
		return new Command(
			"read_counters",
			null,
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let filter = FilterParams.fromValue(args.get("filter"));
				let paging = PagingParams.fromValue(args.get("paging"));
				this._logic.readCounters(correlationId, filter, paging, callback);
			}
		);
	}

	private makeWriteCounterCommand(): ICommand {
		return new Command(
			"write_counter",
			null,
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let counter = args.get("counter");
				this._logic.writeCounter(correlationId, counter, callback);
			}
		);
	}

	private makeWriteCountersCommand(): ICommand {
		return new Command(
			"write_counters",
			null,
			(correlationId: string, args: Parameters, callback: (err: any) => void) => {
				let counters = args.get("counters");
				this._logic.writeCounters(correlationId, counters, callback);
			}
		);
	}

	private makeClearCommand(): ICommand {
		return new Command(
			"clear",
			null,
			(correlationId: string, args: Parameters, callback: (err: any) => void) => {
				this._logic.clear(correlationId, callback);
			}
		);
	}

}