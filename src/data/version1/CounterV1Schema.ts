import { ObjectSchema } from 'pip-services-commons-node';
import { TypeCode } from 'pip-services-commons-node';

export class CounterV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withRequiredProperty('name', TypeCode.String);
        this.withRequiredProperty('type', TypeCode.Long);
        this.withOptionalProperty('time', null); //TypeCode.DateTime);
        this.withOptionalProperty('last', null);
        this.withOptionalProperty('count', TypeCode.Long);
        this.withOptionalProperty('min', null); //TypeCode.Double);
        this.withOptionalProperty('max', null); //TypeCode.Double);
        this.withOptionalProperty('average', null); //TypeCode.Double);
    }
}
