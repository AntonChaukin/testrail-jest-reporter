'use strict';
const got = require('got'), {URLSearchParams} = require('url'), Utils = require('../../src/utils');
const ReporterError = require('../../src/error');
const utils = new Utils();
const post_methods = ['add_result_for_case', 'add_results_for_cases'];
const get_methods = ['get_milestones', 'get_plans', 'get_plan', 'get_runs', 'get_tests']

let defaults = {
    retry: 0,
    responseType: 'json'
}

function Testrail_api(options) {
    this.defaults = options;
}

/**
 * Dispatch a request
 *
 * @param {string} path The API path
 * @param {Object} options The config specific for this request (merged with this.defaults)
 */
Testrail_api.prototype.request = function request(path, options) {
    /*let _url = new URL(this.defaults.prefixUrl);
    _url.pathname = 'index.php?/api/v2/'
    this.defaults.prefixUrl = _url.href;*/
    if (options.method) {
        options.method = options.method.toUpperCase();
    } else if (this.defaults.method) {
        options.method = this.defaults.method.toUpperCase();
    }
    const searchParams = options.searchParams || '';
    options.hooks = {
        init: [_options => {
            console.log(_options);
        }],
        beforeRequest: [_options => {
            /*let _url = new URL(this.defaults.prefixUrl);
            _url.pathname = 'index.php?/api/v2/'+path;
            _url.search = searchParams;
            _options.url = _url;*/
            if (_options.method === 'POST') {
                console.log(_options.headers)
            }
            else if (_options.method === 'GET') {
                console.log(_options.url.href)
            }
        }],
        afterResponse: [response => {
            console.log(response.body)
        }],
        beforeError: [error => new ReporterError(error.message)]
    };
    path = 'index.php?/api/v2/'+path;
    const mergedOptions = got.mergeOptions(this.defaults, options);
    const client = got.extend(mergedOptions);
    return client(path);
};

// Provide aliases for supported request post methods
utils.forEach(post_methods, function forEachMethod(method) {
    Testrail_api.prototype[method] = function(...args) {
        const data = utils.isPlainObject(args[args.length - 1]) ? args[args.length - 1] :  null;
        if (data) args.pop();
        let path = method;
        for(let i=0, len = args.length; i<len; i++) {path += `/${args[i]}`}

        return this.request(path, {
            method: 'POST',
            json: data,
        }).catch((err) => console.log(error(err)));
    };
});

// Provide aliases for supported request get methods
utils.forEach(get_methods, function forEachMethod(method) {
    Testrail_api.prototype[method] = function(...args) {
        const data = utils.isPlainObject(args[args.length - 1]) ? args[args.length - 1] :  null;
        let searchParams = '';
        if (data) {
            args.pop();
            searchParams = new URLSearchParams(data)
        }
        let path = method;
        for(let i=0, len = args.length; i<len; i++) {path += `/${args[i]}`}

        return this.request(path, {
            searchParams,
            resolveBodyOnly: true
        }).catch((err) => {throw new ReporterError(err.message)});
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
