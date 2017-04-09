"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const CountersCommandSet_1 = require("./CountersCommandSet");
class CountersController {
    constructor() {
        this._dependencyResolver = new pip_services_commons_node_2.DependencyResolver();
        this._dependencyResolver.put('read_persistence', new pip_services_commons_node_1.Descriptor('pip-services-counters', 'persistence', '*', '*', '*'));
        this._dependencyResolver.put('write_persistence', new pip_services_commons_node_1.Descriptor('pip-services-counters', 'persistence', '*', '*', '*'));
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new CountersCommandSet_1.CountersCommandSet(this);
        return this._commandSet;
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._readPersistence = this._dependencyResolver.getOneRequired('read_persistence');
        this._writePersistence = this._dependencyResolver.getOptional('write_persistence');
    }
    writeCounter(correlationId, counter, callback) {
        async.each(this._writePersistence, (p, callback) => {
            p.create(correlationId, counter, callback);
        }, (err) => {
            if (callback)
                callback(err, counter);
        });
    }
    writeCounters(correlationId, counters, callback) {
        async.each(this._writePersistence, (p, callback) => {
            async.each(counters, (m, callback) => {
                p.create(correlationId, m, callback);
            }, callback);
        }, (err) => {
            if (callback)
                callback(err);
        });
    }
    readCounters(correlationId, filter, paging, callback) {
        this._readPersistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    clear(correlationId, callback) {
        async.each(this._writePersistence, (p, callback) => {
            p.clear(correlationId, callback);
        }, (err) => {
            if (callback)
                callback(err);
        });
    }
}
exports.CountersController = CountersController;
//# sourceMappingURL=CountersController.js.map