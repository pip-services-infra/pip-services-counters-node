"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const CountersCommandSet_1 = require("./CountersCommandSet");
class CountersController {
    constructor() {
        this._expireCleanupTimeout = 60; // 60 min
        this._expireLogsTimeout = 3; // 3 days
        this._expireErrorsTimeout = 30; // 30 days
        this._interval = null;
        this._source = "";
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
        this._expireCleanupTimeout = config.getAsIntegerWithDefault('options.expire_cleanup_timeout', this._expireCleanupTimeout);
        this._expireLogsTimeout = config.getAsIntegerWithDefault('options._expire_logs_timeout', this._expireLogsTimeout);
        this._expireErrorsTimeout = config.getAsIntegerWithDefault('options._expire_errors_timeout', this._expireErrorsTimeout);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._readPersistence = this._dependencyResolver.getOneRequired('read_persistence');
        this._writePersistence = this._dependencyResolver.getOptional('write_persistence');
        let contextInfo = references.getOneOptional(new pip_services_commons_node_1.Descriptor("pip-services", "context-info", "default", "*", "1.0"));
        if (contextInfo != null && this._source == "")
            this._source = contextInfo.name;
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
        counter.source = counter.source || this._source;
        counter.id = counter.name + "_" + counter.source;
        counter.time = counter.time || new Date();
        let lastCounter = counter;
        async.each(this._writePersistence, (p, callback) => {
            p.addOne(correlationId, counter, (err, data) => {
                lastCounter = data || lastCounter;
                callback(err);
            });
        }, (err) => {
            if (callback)
                callback(err, lastCounter);
        });
    }
    writeCounters(correlationId, counters, callback) {
        if (counters == null || counters.length == 0) {
            if (callback)
                callback(null);
            return;
        }
        _.each(counters, (counter) => {
            counter.source = counter.source || this._source;
            counter.id = counter.name + "_" + counter.source;
            counter.time = counter.time || new Date();
        });
        async.each(this._writePersistence, (p, callback) => {
            p.addBatch(correlationId, counters, callback);
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
    deleteExpired(correlationId, callback) {
        let now = new Date().getTime();
        let expireLogsTime = new Date(now - this._expireLogsTimeout * 24 * 3600000);
        let expireErrorsTime = new Date(now - this._expireErrorsTimeout * 24 * 3600000);
        async.each(this._writePersistence, (p, callback) => {
            p.deleteExpired(correlationId, expireLogsTime, expireErrorsTime, callback);
        }, (err) => {
            if (callback)
                callback(err);
        });
    }
}
exports.CountersController = CountersController;
//# sourceMappingURL=CountersController.js.map