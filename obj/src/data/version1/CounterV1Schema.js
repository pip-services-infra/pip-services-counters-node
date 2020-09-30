"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterV1Schema = void 0;
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class CounterV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('name', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('source', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('type', pip_services3_commons_node_2.TypeCode.Long);
        this.withOptionalProperty('time', null); //TypeCode.DateTime);
        this.withOptionalProperty('last', null);
        this.withOptionalProperty('count', pip_services3_commons_node_2.TypeCode.Long);
        this.withOptionalProperty('min', null); //TypeCode.Double);
        this.withOptionalProperty('max', null); //TypeCode.Double);
        this.withOptionalProperty('average', null); //TypeCode.Double);
    }
}
exports.CounterV1Schema = CounterV1Schema;
//# sourceMappingURL=CounterV1Schema.js.map