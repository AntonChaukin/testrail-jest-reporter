const get_milestone = {
    "type": "object",
    "properties": {
        "start_on": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "integer"
            }]
        },
        "started_on": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "integer"
            }]
        },
        "is_started": {
            "type": "boolean"
        },
        "completed_on": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "integer"
            }]
        },
        "description": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "string"
            }]
        },
        "due_on": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "integer"
            }]
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
            "anyOf": [{
                "type": undefined
            }, {
                "type": "integer"
            }]
        },
        "refs": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "string"
            }]
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
            "anyOf": [{
                "type": undefined
            }, {
                "type": "integer"
            }]
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
            "anyOf": [{
                "type": undefined
            }, {
                "type": "integer"
            }]
        },
        "description": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "string"
            }]
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
                                    "anyOf": [{
                                        "type": undefined
                                    }, {
                                        "type": "string"
                                    }]
                                },
                                "completed_on": {
                                    "anyOf": [{
                                        "type": undefined
                                    }, {
                                        "type": "integer"
                                    }]
                                },
                                "blocked_count": {
                                    "type": "integer"
                                },
                                "config": {
                                    "anyOf": [{
                                        "type": undefined
                                    }, {
                                        "type": "string"
                                    }]
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
                                    "anyOf": [{
                                        "type": undefined
                                    }, {
                                        "type": "integer"
                                    }]
                                },
                                "name": {
                                    "type": "string"
                                },
                                "description": {
                                    "anyOf": [{
                                        "type": undefined
                                    }, {
                                        "type": "string"
                                    }]
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
                                    "anyOf": [{
                                        "type": undefined
                                    }, {
                                        "type": "string"
                                    }]
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
                        "anyOf": [{
                            "type": undefined
                        }, {
                            "type": "string"
                        }]
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
            "anyOf": [{
                "type": undefined
            }, {
                "type": "integer"
            }]
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
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "assignedto_id": {
                "anyOf": [{
                    "type": undefined
                }, {
                    "type": "integer"
                }]
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
                "anyOf": [{
                    "type": undefined
                }, {
                    "type": "integer"
                }]
            },
            "description": {
                "anyOf": [{
                    "type": undefined
                }, {
                    "type": "string"
                }]
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
                "anyOf": [{
                    "type": undefined
                }, {
                    "type": "integer"
                }]
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
};
const get_run = {
    "type": "object",
    "properties": {
        "assignedto_id": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "integer"
            }]
        },
        "blocked_count": {
            "type": "integer"
        },
        "config": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "string"
            }]
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
            "anyOf": [{
                "type": undefined
            }, {
                "type": "integer"
            }]
        },
        "refs": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "string"
            }]
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
            "anyOf": [{
                "type": undefined
            }, {
                "type": "integer"
            }]
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
            "anyOf": [{
                "type": undefined
            }, {
                "type": "integer"
            }]
        },
        "case_id": {
            "type": "integer"
        },
        "custom_automation": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "integer"
            }]
        },
        "custom_preconds": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "string"
            }]
        },
        "custom_steps": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "string"
            }]
        },
        "custom_expected": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "string"
            }]
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
            "anyOf": [{
                "type": undefined
            }, {
                "type": "string"
            }]
        },
        "custom_goals": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "string"
            }]
        },
        "estimate": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "string"
            }]
        },
        "estimate_forecast": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "string"
            }]
        },
        "refs": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "string"
            }]
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
            "anyOf": [{
                "type": undefined
            }, {
                "type": "integer"
            }]
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
            "anyOf": [{
                "type": undefined
            }, {
                "type": "integer"
            }]
        },
        "comment": {
            "type": "string"
        },
        "version": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "string"
            }]
        },
        "elapsed": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "string"
            }]
        },
        "defects": {
            "anyOf": [{
                "type": undefined
            }, {
                "type": "string"
            }]
        },
        "created_by": {
            "type": "integer"
        },
        "attachment_ids": {
            "type": "array",
            "items": {
                "anyOf": [{
                    "type": undefined
                }, {
                    "type": "integer"
                }]
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

module.exports = {
    get_milestone,
    get_milestones: {
        "type": "array",
        "items": get_milestone
    },
    get_plan,
    get_plans,
    get_run,
    get_runs: {
        "type": "array",
        "items": get_run
    },
    get_test,
    get_tests: {
        "type": "array",
        "items": get_test
    },
    add_result_for_case,
    add_results_for_cases: {
        "type": "array",
        "items": add_result_for_case
    }
};