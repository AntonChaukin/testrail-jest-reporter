const add_result_for_case = {
    "type": "object",
    "properties": {
        "status_id": {
            "type": "integer"
        },
        "comment": {
            "type": "string"
        },
        "elapsed": {
            "type": "string"
        },
        "defects": {
            "type": "string"
        },
        "version": {
            "type": "string"
        }
    },
    "required": [
        "status_id",
        "comment",
        "elapsed",
        "defects",
        "version"
    ]
};
const add_results_for_cases = {
    "type": "object",
    "properties": {
        "results": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "case_id": {
                        "type": "integer"
                    },
                    "status_id": {
                        "type": "integer"
                    },
                    "comment": {
                        "type": "string"
                    },
                    "elapsed": {
                        "type": "string"
                    },
                    "defects": {
                        "type": "string"
                    },
                    "version": {
                        "type": "string"
                    }
                },
                "required": [
                    "case_id",
                    "status_id",
                    "comment",
                    "elapsed",
                    "defects",
                    "version"
                ]
            }
        }
    },
    "required": [
        "results"
    ]
};
const add_run = {
    "type": "object",
    "required": [
        "include_all",
        "case_ids",
        "milestone_id"
    ],
    "properties": {
        "suite_id": {
            "type": "integer"
        },
        "milestone_id": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "name": {
            "type": "string"
        },
        "description": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "assignedto_id": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "refs": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "include_all": {
            "type": "boolean"
        },
        "case_ids": {
            "anyOf": [{
                "type": "null"
            }, {
                "type": "array",
                "items": {
                    "type": "integer"
                }
            }]
        }
    },
};

const add_attachment_to_result = {};

module.exports = {
    add_result_for_case,
    add_results_for_cases,
    add_run,
    update_run: add_run,
    add_attachment_to_result
};