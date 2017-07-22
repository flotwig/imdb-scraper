"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redis = require("redis");
var Cache = (function () {
    function Cache() {
        this.inMemory = {};
        if (process.env.REDIS_URL)
            this.redis = redis.createClient(process.env.REDIS_URL);
    }
    // miss may be called and expected to call the callback with a value for ID
    // hit will be called at the end with a valid value for id
    Cache.prototype.get = function (id, miss, hit) {
        var _this = this;
        if (this.redis) {
            this.redis.get(id, function (err, reply) {
                if (!err && reply) {
                    try {
                        hit(JSON.parse(reply));
                    }
                    catch (e) {
                        _this.redis.del(id);
                        _this.set(id, miss, hit);
                    }
                }
                else
                    _this.set(id, miss, hit);
            });
        }
        else {
            if (this.inMemory.hasOwnProperty(id))
                hit(JSON.parse(this.inMemory[id]));
            else
                this.set(id, miss, hit);
        }
    };
    Cache.prototype.set = function (id, miss, hit) {
        var _this = this;
        miss(function (value) {
            var encodedValue = JSON.stringify(value);
            if (_this.redis)
                _this.redis.set(id, encodedValue);
            else
                _this.inMemory[id] = encodedValue;
            hit(value);
        });
    };
    return Cache;
}());
exports.Cache = Cache;
