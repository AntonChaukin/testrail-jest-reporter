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
}
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

module.exports = {
    add_result_for_case,
    add_results_for_cases
};