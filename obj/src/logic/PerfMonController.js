"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const PerfMonCommandSet_1 = require("./PerfMonCommandSet");
class PerfMonController {
    constructor() {
        this._expireCleanupTimeout = 60; // 60 min
        this._expireTimeout = 3; // 3 days
        this._interval = null;
        this._dependencyResolver = new pip_services_commons_node_2.DependencyResolver();
        this._dependencyResolver.put('persistence', new pip_services_commons_node_1.Descriptor('pip-services-perfmon', 'persistence', '*', '*', '*'));
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new PerfMonCommandSet_1.CountersCommandSet(this);
        return this._commandSet;
    }
    configure(config) {
        this._dependencyResolver.configure(config);
        this._expireCleanupTimeout = config.getAsIntegerWithDefault('options.expire_cleanup_timeout', this._expireCleanupTimeout);
        this._expireTimeout = config.getAsIntegerWithDefault('options._expire_counter_timeout', this._expireTimeout);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
    }
    isOpened() {
        return this._interval != null;
    }
    open(correlationId, callback) {
        if (this._interval != null) {
            clearInterval(this._interval);
        }
        this._interval = setInterval(() => {
            this.deleteExpired(correlationId, null);
        }, 1000 * 60 * this._expireCleanupTimeout);
        if (callback != null)
            callback(null);
    }
    close(correlationId, callback) {
        if (this._interval != null) {
            clearTimeout(this._interval);
            this._interval = null;
        }
        if (callback != null)
            callback(null);
    }
    writeCounter(correlationId, counter, callback) {
        counter.id = counter.name + "_" + counter.source;
        counter.time = counter.time || new Date();
        this._persistence.addOne(correlationId, counter, callback);
    }
    writeCounters(correlationId, counters, callback) {
        if (counters == null || counters.length == 0) {
            if (callback)
                callback(null);
            return;
        }
        _.each(counters, (counter) => {
            counter.id = counter.name + "_" + counter.source;
            counter.time = counter.time || new Date();
        });
        this._persistence.addBatch(correlationId, counters, callback);
    }
    readCounters(correlationId, filter, paging, callback) {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    clear(correlationId, callback) {
        this._persistence.clear(correlationId, callback);
    }
    deleteExpired(correlationId, callback) {
        let now = new Date().getTime();
        let expireTime = new Date(now - this._expireTimeout * 24 * 3600000);
        this._persistence.deleteExpired(correlationId, expireTime, callback);
    }
}
exports.PerfMonController = PerfMonController;
//# sourceMappingURL=PerfMonController.js.map