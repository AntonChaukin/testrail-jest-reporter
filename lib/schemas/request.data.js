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
const add_milestone = {
    "type": "object",
    "required": [
        "name",
        "description"
    ],
    "properties": {
        "name": {
            "type": "string"
        },
        "description": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "due_on": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "parent_id": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "refs": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "start_on": {
            "oneOf": [{ "type": ["null", "string"] }]
        }
    },
};

module.exports = {
    add_result_for_case,
    add_results_for_cases,
    add_run,
    update_run: add_run,
    add_milestone
};