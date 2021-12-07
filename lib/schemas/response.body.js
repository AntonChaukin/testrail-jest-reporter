const get_project = {
    "type": "object",
    "required": [
        "id",
        "name",
        "suite_mode",
    ],
    "properties": {
        "announcement": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "completed_on": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "id": {
            "type": "integer"
        },
        "is_completed": {
            "type": "boolean"
        },
        "name": {
            "type": "string"
        },
        "show_announcement": {
            "type": "boolean"
        },
        "suite_mode": {
            "type": "integer"
        },
        "url": {
            "type": "string"
        }
    }
}
const get_milestone = {
    "type": "object",
    "properties": {
        "start_on": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "started_on": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "is_started": {
            "type": "boolean"
        },
        "completed_on": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "description": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "due_on": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "id": {
            "type": "integer"
        },
        "is_completed": {
            "type": "boolean"
        },
        "name": {
            "type": "string"
        },
        "project_id": {
            "type": "integer"
        },
        "parent_id": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "refs": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "url": {
            "type": "string"
        }
    },
    "required": [
        "completed_on",
        "description",
        "id",
        "is_completed",
        "name",
        "project_id",
        "url"
    ]
};
const get_plan = {
    "type": "object",
    "properties": {
        "assignedto_id": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "blocked_count": {
            "type": "integer"
        },
        "created_by": {
            "type": "integer"
        },
        "created_on": {
            "type": "integer"
        },
        "completed_on": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "description": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "custom_status1_count": {
            "type": "integer"
        },
        "custom_status2_count": {
            "type": "integer"
        },
        "custom_status3_count": {
            "type": "integer"
        },
        "custom_status4_count": {
            "type": "integer"
        },
        "custom_status5_count": {
            "type": "integer"
        },
        "custom_status6_count": {
            "type": "integer"
        },
        "custom_status7_count": {
            "type": "integer"
        },
        "entries": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string"
                    },
                    "include_all": {
                        "type": "boolean"
                    },
                    "name": {
                        "type": "string"
                    },
                    "runs": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "assignedto_id": {
                                    "oneOf": [{ "type": ["null", "integer"] }]
                                },
                                "completed_on": {
                                    "oneOf": [{ "type": ["null", "integer"] }]
                                },
                                "blocked_count": {
                                    "type": "integer"
                                },
                                "config": {
                                    "oneOf": [{ "type": ["null", "string"] }]
                                },
                                "config_ids": {
                                    "type": "array",
                                    "items": {
                                        "oneOf": [{ "type": ["null", "integer"] }]
                                    }
                                },
                                "custom_status1_count": {
                                    "type": "integer"
                                },
                                "custom_status2_count": {
                                    "type": "integer"
                                },
                                "custom_status3_count": {
                                    "type": "integer"
                                },
                                "custom_status4_count": {
                                    "type": "integer"
                                },
                                "custom_status5_count": {
                                    "type": "integer"
                                },
                                "custom_status6_count": {
                                    "type": "integer"
                                },
                                "custom_status7_count": {
                                    "type": "integer"
                                },
                                "entry_id": {
                                    "type": "string"
                                },
                                "entry_index": {
                                    "type": "integer"
                                },
                                "failed_count": {
                                    "type": "integer"
                                },
                                "id": {
                                    "type": "integer"
                                },
                                "include_all": {
                                    "type": "boolean"
                                },
                                "is_completed": {
                                    "type": "boolean"
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
                                "passed_count": {
                                    "type": "integer"
                                },
                                "plan_id": {
                                    "type": "integer"
                                },
                                "project_id": {
                                    "type": "integer"
                                },
                                "retest_count": {
                                    "type": "integer"
                                },
                                "refs": {
                                    "oneOf": [{ "type": ["null", "string"] }]
                                },
                                "suite_id": {
                                    "type": "integer"
                                },
                                "untested_count": {
                                    "type": "integer"
                                },
                                "created_on": {
                                    "type": "integer"
                                },
                                "created_by": {
                                    "type": "integer"
                                },
                                "url": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "assignedto_id",
                                "completed_on",
                                "config",
                                "config_ids",
                                "entry_id",
                                "entry_index",
                                "id",
                                "include_all",
                                "is_completed",
                                "milestone_id",
                                "name",
                                "plan_id",
                                "project_id",
                                "suite_id",
                                "url"
                            ]
                        }
                    },
                    "refs": {
                        "oneOf": [{ "type": ["null", "string"] }]
                    },
                    "suite_id": {
                        "type": "integer"
                    }
                },
                "required": [
                    "id",
                    "description",
                    "include_all",
                    "name",
                    "runs",
                    "suite_id"
                ]
            }
        },
        "failed_count": {
            "type": "integer"
        },
        "id": {
            "type": "integer"
        },
        "is_completed": {
            "type": "boolean"
        },
        "milestone_id": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "name": {
            "type": "string"
        },
        "passed_count": {
            "type": "integer"
        },
        "project_id": {
            "type": "integer"
        },
        "retest_count": {
            "type": "integer"
        },
        "untested_count": {
            "type": "integer"
        },
        "url": {
            "type": "string"
        }
    },
    "required": [
        "assignedto_id",
        "completed_on",
        "created_on",
        "description",
        "entries",
        "id",
        "is_completed",
        "milestone_id",
        "name",
        "project_id",
        "url"
    ]
};
const get_plans = {
    "type": "object",
    "required": [
        "offset",
        "limit",
        "size",
        "_links",
        "plans"
    ],
    "properties": {
        "offset": {
            "type": "integer",
        },
        "limit": {
            "type": "integer",
        },
        "size": {
            "type": "integer",
        },
        "_links": {
            "type": "object",
            "required": [
                "next",
                "prev"
            ],
            "properties": {
                "next": {
                    "oneOf": [{ "type": ["null", "string"] }]
                },
                "prev": {
                    "oneOf": [{ "type": ["null", "string"] }]
                }
            },
            "additionalProperties": false
        },
        "plans": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "assignedto_id": {
                    "oneOf": [{ "type": ["null", "integer"] }]
                },
                "blocked_count": {
                    "type": "integer"
                },
                "created_by": {
                    "type": "integer"
                },
                "created_on": {
                    "type": "integer"
                },
                "completed_on": {
                    "oneOf": [{ "type": ["null", "integer"] }]
                },
                "description": {
                    "oneOf": [{ "type": ["null", "string"] }]
                },
                "custom_status1_count": {
                    "type": "integer"
                },
                "custom_status2_count": {
                    "type": "integer"
                },
                "custom_status3_count": {
                    "type": "integer"
                },
                "custom_status4_count": {
                    "type": "integer"
                },
                "custom_status5_count": {
                    "type": "integer"
                },
                "custom_status6_count": {
                    "type": "integer"
                },
                "custom_status7_count": {
                    "type": "integer"
                },
                "failed_count": {
                    "type": "integer"
                },
                "id": {
                    "type": "integer"
                },
                "is_completed": {
                    "type": "boolean"
                },
                "milestone_id": {
                    "oneOf": [{ "type": ["null", "integer"] }]
                },
                "name": {
                    "type": "string"
                },
                "passed_count": {
                    "type": "integer"
                },
                "project_id": {
                    "type": "integer"
                },
                "retest_count": {
                    "type": "integer"
                },
                "untested_count": {
                    "type": "integer"
                },
                "url": {
                    "type": "string"
                }
            },
            "required": [
                "assignedto_id",
                "completed_on",
                "created_on",
                "description",
                "id",
                "is_completed",
                "milestone_id",
                "name",
                "project_id",
                "url"
            ]
        }
    }
    }
};
const get_run = {
    "type": "object",
    "properties": {
        "assignedto_id": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "blocked_count": {
            "type": "integer"
        },
        "config": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "config_ids": {
            "type": "array",
            "items": {
                "anyOf": [{
                    "type": undefined
                }, {
                    "type": "integer"
                }]
            }
        },
        "created_by": {
            "type": "integer"
        },
        "created_on": {
            "type": "integer"
        },
        "updated_on": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "refs": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "custom_status1_count": {
            "type": "integer"
        },
        "custom_status2_count": {
            "type": "integer"
        },
        "custom_status3_count": {
            "type": "integer"
        },
        "custom_status4_count": {
            "type": "integer"
        },
        "custom_status5_count": {
            "type": "integer"
        },
        "custom_status6_count": {
            "type": "integer"
        },
        "custom_status7_count": {
            "type": "integer"
        },
        "failed_count": {
            "type": "integer"
        },
        "id": {
            "type": "integer"
        },
        "include_all": {
            "type": "boolean"
        },
        "is_completed": {
            "type": "boolean"
        },
        "milestone_id": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "name": {
            "type": "string"
        },
        "passed_count": {
            "type": "integer"
        },
        "project_id": {
            "type": "integer"
        },
        "retest_count": {
            "type": "integer"
        },
        "suite_id": {
            "type": "integer"
        },
        "untested_count": {
            "type": "integer"
        },
        "url": {
            "type": "string"
        }
    },
    "required": [
        "assignedto_id",
        "created_by",
        "created_on",
        "description",
        "id",
        "include_all",
        "is_completed",
        "milestone_id",
        "name",
        "project_id",
        "suite_id",
        "updated_on",
        "url"
    ]
};
const get_test = {
    "type": "object",
    "properties": {
        "assignedto_id": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "case_id": {
            "type": "integer"
        },
        "custom_automation": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "custom_preconds": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "custom_steps": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "custom_expected": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "custom_steps_separated": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "content": {
                            "type": "string"
                        },
                        "expected": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "content",
                        "expected"
                    ]
                }
            }]
        },
        "custom_mission": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "custom_goals": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "estimate": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "estimate_forecast": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "refs": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "id": {
            "type": "integer"
        },
        "priority_id": {
            "type": "integer"
        },
        "run_id": {
            "type": "integer"
        },
        "status_id": {
            "type": "integer"
        },
        "milestone_id": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "title": {
            "type": "string"
        },
        "template_id": {
            "type": "integer"
        },
        "type_id": {
            "type": "integer"
        }
    },
    "required": [
        "assignedto_id",
        "case_id",
        "custom_expected",
        "custom_preconds",
        "custom_steps_separated",
        "estimate",
        "estimate_forecast",
        "id",
        "priority_id",
        "run_id",
        "status_id",
        "title",
        "type_id"
    ]
};
const add_result_for_case = {
    "type": "object",
    "properties": {
        "id": {
            "type": "integer"
        },
        "test_id": {
            "type": "integer"
        },
        "status_id": {
            "type": "integer"
        },
        "created_on": {
            "type": "integer"
        },
        "assignedto_id": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "comment": {
            "type": "string"
        },
        "version": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "elapsed": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "defects": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "created_by": {
            "type": "integer"
        },
        "attachment_ids": {
            "type": "array",
            "items": {
                "oneOf": [{ "type": ["null", "integer"] }]
            }
        }
    },
    "required": [
        "id",
        "test_id",
        "status_id",
        "created_on",
        "comment",
        "elapsed",
        "defects",
        "created_by",
    ]
};
const get_case = {
    "type": "object",
    "required": [
        "created_by",
        "created_on",
        "id",
        "milestone_id",
        "priority_id",
        "suite_id",
        "title",
        "type_id",
    ],
    "properties": {
        "created_by": {
            "type": "integer",
        },
        "created_on": {
            "type": "integer",
        },
        "custom_expected": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "custom_preconds": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "custom_steps": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "custom_steps_separated": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "array",
                "additionalItems": true,
                "items": {
                    "anyOf": [
                        {
                            "type": "object",
                            "properties": {
                                "content": {
                                    "type": "string",
                                },
                                "expected": {
                                    "type": "string",
                                }
                            },
                            "additionalProperties": true
                        }
                    ]
                }
            }]
        },
        "estimate": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "estimate_forecast": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "id": {
            "type": "integer",
        },
        "milestone_id": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "priority_id": {
            "type": "integer",
        },
        "refs": {
            "oneOf": [{ "type": ["null", "string"] }]
        },
        "section_id": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "suite_id": {
            "type": "integer",
        },
        "title": {
            "type": "string",
        },
        "type_id": {
            "type": "integer",
        },
        "updated_by": {
            "oneOf": [{ "type": ["null", "integer"] }]
        },
        "updated_on": {
            "oneOf": [{
                "type": ["null", "integer"]
            }]
        }
    },
    "additionalProperties": true
};
const get_suite = {
    "type": "object",
    "required": [
        "id",
        "name",
        "project_id"
    ],
    "properties": {
        "id": {
            "type": "integer"
        },
        "name": {
            "type": "string"
        },
        "project_id": {
            "type": "integer"
        }
    },
    "additionalProperties": true
};
const get_milestones = {
    "type": "object",
    "required": [
        "offset",
        "limit",
        "size",
        "_links",
        "milestones"
    ],
    "properties": {
        "offset": {
            "type": "integer",
        },
        "limit": {
            "type": "integer",
        },
        "size": {
            "type": "integer",
        },
        "_links": {
            "type": "object",
            "required": [
                "next",
                "prev"
            ],
            "properties": {
                "next": {
                    "type": "null",
                },
                "prev": {
                    "type": "null",
                }
            },
            "additionalProperties": false
        },
        "milestones": {
            "type": "array",
            "items": get_milestone
        }
    },
    "additionalProperties": false
};
const get_runs = {
    "type": "object",
    "required": [
        "offset",
        "limit",
        "size",
        "_links",
        "runs"
    ],
    "properties": {
        "offset": {
            "type": "integer",
        },
        "limit": {
            "type": "integer",
        },
        "size": {
            "type": "integer",
        },
        "_links": {
            "type": "object",
            "required": [
                "next",
                "prev"
            ],
            "properties": {
                "next": {
                    "oneOf": [{ "type": ["null", "string"] }]
                },
                "prev": {
                    "oneOf": [{ "type": ["null", "string"] }]
                }
            },
            "additionalProperties": false
        },
        "runs": {
            "type": "array",
            "items": get_run
        }
    },
    "additionalProperties": false
};
const get_tests = {
    "type": "object",
    "required": [
        "offset",
        "limit",
        "size",
        "_links",
        "tests"
    ],
    "properties": {
        "offset": {
            "type": "integer",
        },
        "limit": {
            "type": "integer",
        },
        "size": {
            "type": "integer",
        },
        "_links": {
            "type": "object",
            "required": [
                "next",
                "prev"
            ],
            "properties": {
                "next": {
                    "oneOf": [{ "type": ["null", "string"] }]
                },
                "prev": {
                    "oneOf": [{ "type": ["null", "string"] }]
                }
            },
            "additionalProperties": false
        },
        "tests": {
            "type": "array",
            "items": get_test
        }
    },
    "additionalProperties": false
}

module.exports = {
    get_project,
    get_milestone,
    get_milestones,
    get_plan,
    get_plans,
    get_run,
    get_runs,
    get_test,
    get_tests,
    get_case,
    get_suite,
    add_result_for_case,
    add_results_for_cases: {
        "type": "array",
        "items": add_result_for_case
    },
    add_run: get_run,
    update_run: get_run
};