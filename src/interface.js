'use strict';
const rp = require('request-promise'), Utils = require('./utils'), ReporterError = require('./error');
const validator = require('./validator');
const utils = new Utils();
const post_methods = ['add_result_for_case', 'add_results_for_cases'];
const get_methods = ['get_milestones', 'get_plans', 'get_plan', 'get_runs', 'get_tests']

let defaults = {
    headers: {
        'Content-Type': 'application/json'
    },
    json: true,
    jar: true,
    resolveWithFullResponse: true
}

function Testrail_api(config) {
    this.defaults = config;
}

/**
 * Dispatch a request
 *
 * @param {string} uri
 * @param {array} args The config specific for this request (merged with this.defaults)
 */
Testrail_api.prototype.request = function request(uri, ...args) {
    const _base = rp.defaults(this.defaults);
    let caller;
    let _path = uri;
    const validate = validator(uri);
    const data = utils.isPlainObject(args[args.length - 1]) ? args[args.length - 1] :  null;
    if (data) args.pop();

    if(utils.isPlainObject(args[0]) && args[0].method ===  'POST') {
        args.shift();
        validate.data(data);
        caller = _base.defaults({
            method: 'POST',
            body: data,
            followAllRedirects: true
        });
    } else {
        caller =_base.defaults({qs: data});
    }

    for(let i=0, len = args.length; i<len; i++) {_path += `/${args[i]}`}

    return caller(_path)
        .then(resp => {
            switch (resp.statusCode) {
                case 200:
                    break;
                default:
                    throw new ReporterError(`\nUnexpected response status code ${resp.statusCode} 
                    \n${JSON.stringify(resp, null, 2)}`)
            }
            validate.body(resp.body);
            return resp.body;
        })
        .catch(error => {throw new ReporterError(`\n${error.message}`)});
};

// Provide aliases for supported request post methods
utils.forEach(post_methods, function forEachMethod(method) {
    Testrail_api.prototype[method] = function(...args) {
        return this.request(method, {method: 'POST'}, ...args)
    };
});

// Provide aliases for supported request get methods
utils.forEach(get_methods, function forEachMethod(method) {
    Testrail_api.prototype[method] = function(...args) {
        return this.request(method, ...args)
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
