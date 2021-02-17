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
        "case_ids"
    ],
    "properties": {
        "suite_id": {
            "type": "integer"
        },
        "milestone_id": {
            "oneOf": [{
                "type": undefined
            }, {
                "type": "integer"
            }]
        },
        "name": {
            "type": "string"
        },
        "description": {
            "oneOf": [{
                "type": undefined
            }, {
                "type": "string"
            }]
        },
        "assignedto_id": {
            "oneOf": [{
                "type": undefined
            }, {
                "type": "integer"
            }]
        },
        "refs": {
            "oneOf": [{
                "type": undefined
            }, {
                "type": "string"
            }]
        },
        "include_all": {
            "type": "boolean"
        },
        "case_ids": {
            "oneOf": [{
                "type": undefined
            }, {
                "type": "array",
                "items": {
                    "anyOf": [
                        {
                            "type": "integer"
                        }
                    ]
                }
            }]
        }
    },
};

module.exports = {
    add_result_for_case,
    add_results_for_cases,
    add_run,
    update_run: add_run
};