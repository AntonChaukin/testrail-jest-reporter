'use strict';
const rp = require('request-promise'), chalk = require('chalk'), Utils = require('./utils');
const error = chalk.bold.red;
const utils = new Utils();
const post_methods = ['add_result_for_case', 'add_results_for_cases'];
const get_methods = ['get_milestones', 'get_plans', 'get_plan', 'get_runs', 'get_tests']

let defaults = {
    headers: {
        'Authorization': null,
        'Content-Type': 'application/json'
    },
    json: true,
    jar: true
}

function Testrail_api(config) {
    this.defaults = config;
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Testrail_api.prototype.request = function request(config) {
    if (typeof config === 'string') {
        config = arguments[1] || {};
        config.uri = arguments[0];
    } else {
        config = config || {};
    }

    config = mergeConfig(this.defaults, config);

    if (config.method) {
        config.method = config.method.toUpperCase();
    } else if (this.defaults.method) {
        config.method = this.defaults.method.toUpperCase();
    }

    return rp(config);
};

// Provide aliases for supported request post methods
utils.forEach(post_methods, function forEachMethod(method) {
    Testrail_api.prototype[method] = function(...args) {
        const data = typeof args[args.length - 1] === 'object' ? args[args.length - 1] :  null;
        if (data) args.pop();
        let uri = method;
        for(let i=0, len = args.length; i<len; i++) {uri += `/${args[i]}`}

        return this.request({
            method: 'POST',
            uri: uri,
            body: data,
            followAllRedirects: true,
            resolveWithFullResponse: true
        }).catch((err) => console.log(error(err)));
    };
});

// Provide aliases for supported request get methods
utils.forEach(get_methods, function forEachMethod(method) {
    Testrail_api.prototype[method] = function(...args) {
        const data = typeof args[args.length - 1] === 'object' ? args[args.length - 1] :  null;
        if (data) args.pop();
        let uri = method;
        for(let i=0, len = args.length; i<len; i++) {uri += `/${args[i]}`}

        return this.request({
            uri: uri,
            qs: data
        }).catch((err) => {throw new Error(err)});
    };
});

function createInstance(defaultConfig) {
    const context = new Testrail_api(defaultConfig);
    let instance = bind(Testrail_api.prototype.request, context);
    // Copy api.prototype to instance
    extend(instance, Testrail_api.prototype, context);
    // Copy context to instance
    extend(instance, context);

    return instance;
}

// Create the default instance to be exported
let api = createInstance(defaults);

module.exports = api;

function bind(fn, thisArg) {
    return function wrap() {
        const args = new Array(arguments.length);
        for (let i = 0; i < args.length; i++) {
            args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
    };
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
    utils.forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
            a[key] = bind(val, thisArg);
        } else {
            a[key] = val;
        }
    });
    return a;
}

function mergeConfig(config1, config2) {
    config2 = config2 || {};
    let config = {};
    let otherKeys = Object
        .keys(config1)
        .concat(Object.keys(config2))
        .filter(function filterKeys(key) {
            return key !== 'headers' || key !== 'uri';
        });

    mergeProperties('headers');
    utils.forEach(otherKeys, mergeProperties);
    config['uri'] = config1['uri'] + config2['uri'];

    return config;

    function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
            return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
            return utils.merge({}, source);
        } else if (utils.isArray(source)) {
            return source.slice();
        }
        return source;
    }

    function mergeProperties(prop) {
        if (typeof config2[prop] !== 'undefined') {
            config[prop] = getMergedValue(config1[prop], config2[prop]);
        } else if (typeof config1[prop] !== 'undefined') {
            config[prop] = getMergedValue(undefined, config1[prop]);
        }
    }
}