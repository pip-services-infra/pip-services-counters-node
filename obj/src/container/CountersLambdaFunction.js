"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_aws_node_1 = require("pip-services-aws-node");
const CountersServiceFactory_1 = require("../build/CountersServiceFactory");
class CountersLambdaFunction extends pip_services_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("counters", "Performance counters function");
        this._dependencyResolver.put('controller', new pip_services_commons_node_1.Descriptor('pip-services-counters', 'controller', 'default', '*', '*'));
        this._factories.add(new CountersServiceFactory_1.CountersServiceFactory());
    }
}
exports.CountersLambdaFunction = CountersLambdaFunction;
exports.handler = new CountersLambdaFunction().getHandler();
//# sourceMappingURL=CountersLambdaFunction.js.map