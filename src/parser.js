'use strict';
const _  = require('lodash');

const parseString = (sample) => {
    return {
        type: 'string'
    };
};

const parseNumber = (sample) => {
    let schema = {
        "type": "number"
    };

    if(_.isInteger(sample)) {
        schema.type = "integer";
    }

    return schema;
};

const parseBoolean = (sample) => {
    return {
        "type": "boolean"
    };
};

const parseArray = (sample) => {
    return {
        "type": "array",
        "items": parse(sample)
    };
};

const parseObject = (sample) => {
    let schema = {
        "type": "object",
        "properties": {},
        "required": _.keys(sample)
    };

    _.forOwn(sample, (value, property) => {
        _.set(schema, `properties.${property}`, parse(value));
    });

    return schema;
};

const parse = (sample) => {
    if(_.isString(sample)) return parseString(sample);
    if(_.isNumber(sample)) return parseNumber(sample);
    if(_.isBoolean(sample)) return parseBoolean(sample);
    if(_.isArray(sample)) return parseArray(_.first(sample));
    if(_.isObject(sample)) return parseObject(sample);
};

module.exports = {
    parse
};