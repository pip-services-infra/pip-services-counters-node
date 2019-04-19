"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_aws_node_1 = require("pip-services3-aws-node");
const PerfMonServiceFactory_1 = require("../build/PerfMonServiceFactory");
class PerfMonLambdaFunction extends pip_services3_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("perfmon", "Performance counters function");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('pip-services-perfmon', 'controller', 'default', '*', '*'));
        this._factories.add(new PerfMonServiceFactory_1.PerfMonServiceFactory());
    }
}
exports.PerfMonLambdaFunction = PerfMonLambdaFunction;
exports.handler = new PerfMonLambdaFunction().getHandler();
//# sourceMappingURL=PerfMonLambdaFunction.js.map