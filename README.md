[![TestRail v6.7](https://img.shields.io/badge/TestRail%20API-v2-green.svg)](http://docs.gurock.com/testrail-api2/start) [![NPM](https://img.shields.io/npm/l/testrail-jest-reporter)](https://github.com/AntonChaukin/testrail-jest-reporter/blob/main/LICENSE) [![NPM](https://img.shields.io/node/v/testrail-jest-reporter)](https://github.com/AntonChaukin/testrail-jest-reporter/blob/main/package.json)


# Jest to TestRail Reporter
This package allows you to use [Jest](https://jestjs.io/) and report  your test results to [TestRail](http://www.gurock.com/testrail/).
<br>**Please use with combination with the default reporter**

## Install

```code
npm i testrail-jest-reporter --save-dev
```

## Jest configurations

As per [Jest's documentation](https://facebook.github.io/jest/docs/en/configuration.html#reporters-array-modulename-modulename-options), 
the Reporter must be specified in the jest-config.js or package.json file as part of the `reporters` array.
 - This file should be created in your project's root folder.
 - Parameter is defined as 'project_id', which is the id of your project on TestRail.
 - Specify the TestRail server url as parameter 'baseUrl' _(recommended)_.
 - Specify the TestRail Milestone name as parameter 'milestone' _(recommended)_.
 - There is no 'pending' or 'skipped' test result status in the TestRail results default <br>statuses. 
 You can add your custom status to the TestRail and specify it id as parameter 
 <br>'"statuses":{"pending": "7"}' _(recommended)_.
#### Usage
```javascript
// this is the part of the jest-config.js
module.exports = {
  ...,
  reporters: [
    "default",
    [
        "jest-2-testrail", 
        { project_id: "1", 
            baseUrl: 'http://localhost', 
            milestone: '<milestone_name>',
            statuses: {pending: "7"}
        },
    ]
  ], 
    ...
};
```
```js
// this is the "jest" part of the package.json
{
  "jest": {
    "reporters": [
      "default",
        [
            "jest-2-testrail",
            { 
                "project_id": "1",
                "baseUrl": 'http://localhost',
                "milestone": '<milestone_name>',
                "statuses": {"pending": "7"}
            }
        ]
    ]
  }
}
```

## TestRail configurations

The **testrail.conf.js** file needs to be created in your project's root folder.
 - It must contain the URL of your TestRail server, username (email address) and password (or API key).
 - This file needs to have all 3 parameters correctly filled.
### Use TestRail Milestone
In first version the Reporter needs you to use milestone.
 - Use TestRail Milestone to versioning your tests.
 - **testrail.conf.js** file needs to have Milestone name filled. Or <br>it can be specified in
[Jest configuration](https://github.com/AntonChaukin/testrail-jest-reporter#jest-configurations)
 - You can specify custom regex expresion _(default: `/[?\d]{3,6}/gm`)_
#### Example
```js
module.exports = {
    'baseUrl': 'http://localhost',
    'user': 'user@example.com',
    'pass': 'some-password',
    'milestone': '<milestone_name>',
    'regex': /[?\d]{3,6}/gm
}
```
### Enable TestRail API
In order to use [TestRail API](http://docs.gurock.com/testrail-api2/start), it needs to be enabled by an administrator
<br>in your own TestRail Site Settings.
Also, if you want to use API authentication instead of your password,
<br>enable session authentication for API in the TestRail Site Settings,
<br>and add an API key in your User settings _(This is recommended)_.
### Add TestRail tests Runs
In first version the Reporter needs you to add tests Runs with all tests you want to automate.
The Reporter parse all TestRail tests Plans
<br>and test Runs of the Milestone to collect testcases.
The Reporter collects only unique testcases,
<br>if you have several tests Runs with one testcase
then The Reporter push the test result only to one of that Runs.

## Example tests

The Case ID from TestRail may be added to **_it()_** description 
each test result you want to push to TestRail.
#### Usage
```javascript
describe("Tests suite", () => {
  // "C123" this is Case ID from Test Rail
  it("C123 test success", async () => {
    expect(1).toBe(1);
  });

  it("Test fail C124", async () => {
    expect(1).toBe(0);
  });

  xit("Another success test", async () => {
    expect(1).toBe(1);
  });
});
```
**Note:** The Case ID is a unique and permanent ID of every test case (e.g. C125),
and shouldn't be confused with a Test Case ID, <br>which is assigned to a test case when a new run is created (e.g. T325).

**Note**: The first and second **_it()_** test result will be reported, and the last - not.

## Roadmap
**This version:**
- Add new tests Run if there are testcases that are not present in any of the existing TestRail tests Runs.
- Add new test Runs if the Milestone not specified.
- Add new TestRail Milestone if the specified Milestone not present in the Project.
- Also need to write more tests.

<br>**Version 2:**
- Add the Reporter CLI.

<br>**Version 3:**
- Add ability to parse code annotations.
- Add new TestRail testcase if **_it()_** description not specified by Case ID.
- Add maintenance the TestRail test Plan and test Configurations.


## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/AntonChaukin/testrail-jest-reporter/blob/main/LICENSE) file for details.