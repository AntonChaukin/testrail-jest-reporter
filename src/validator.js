const Ajv = require("ajv").default, ReporterError = require('./error');
const {body: schema_body, data: schema_data} = require('./schemas');

const ajv_body = new Ajv({
    strict: false,
    allErrors: true,
    schemas: schema_body
});

const ajv_data = new Ajv({
    strict: false,
    allErrors: true,
    schemas: schema_data
});

module.exports = function validate(method) {
    const key = method;
    return {
        body: (body) => {
            const valid = ajv_body.validate(key, body);
            if (!valid) {
                throw new ReporterError(`\nTestRail API method ${key} response parsing error:
                    \n${JSON.stringify(ajv_body.errors, null, 2)}`);
            }
        },
        data: (data) => {
            const valid = ajv_data.validate(key, data);
            if (!valid) {
                throw new ReporterError(`\nInvalid request data for method ${key} 
                    Context: ${JSON.stringify(data)}\n${JSON.stringify(ajv_data.errors, null, 2)}`);
            }
        }
    }

}
