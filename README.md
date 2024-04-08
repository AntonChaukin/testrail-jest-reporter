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
 - Specify the TestRail **`suite mode`** id as parameter 'suite_mode' _(recommended)_. If that parameter is not specified, the Reporter will get this automatically. 
     >single repository for all cases - `suite_mode:1`<br>
     single repository with baseline support - `suite_mode:2`<br>
     multiple test suites to manage cases - `suite_mode:3`<br>
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
        "testrail-jest-reporter", 
        { project_id: 1, 
            baseUrl: 'http://localhost', 
            milestone: '<milestone_name>',
            suite_mode: 3,
            statuses: {pending: 7}
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
            "testrail-jest-reporter",
            { 
                "project_id": "1",
                "baseUrl": 'http://localhost',
                "milestone": '<milestone_name>',
                "suite_mode": "3",
                "statuses": {"pending": "7"}
            }
        ]
    ]
  }
}
```

## TestRail configurations

The **testrail.conf.js** file needs to be created in your project's root folder.
 - It must contain your TestRail username (email address) and password (or API key).
 - This file needs to have all 2 parameters correctly filled.
 - It may contain the URL of your TestRail server as a `baseUrl` parameter, or <br>it can be specified in
   [Jest configuration](https://github.com/AntonChaukin/testrail-jest-reporter#jest-configurations)
 - You can specify custom regex expresion _(default: `/[C][?\d]{3,6}/gm`)_
### Use TestRail Milestone
The first version of the Reporter requires you to use a milestone.
 - Use TestRail Milestone to versioning your tests.
 - **testrail.conf.js** file needs to have Milestone name filled. Or <br>it can be specified in
[Jest configuration](https://github.com/AntonChaukin/testrail-jest-reporter#jest-configurations)

#### Example
```js
module.exports = {
    'baseUrl': 'http://localhost',
    'user': 'user@example.com',
    'pass': 'some-password',
    'milestone': '<milestone_name>',
    'regex': /[C][?\d]{3,6}/gm
}
```

##### **Important:**  If you use a public repository, please, secure your sensitive data.
### Enable TestRail API
In order to use [TestRail API](http://docs.gurock.com/testrail-api2/start), it needs to be enabled by an administrator
<br>in your own TestRail Site Settings.
Also, if you want to use API authentication instead of your password,
<br>enable session authentication for API in the TestRail Site Settings,
<br>and add an API key in your User settings _(This is recommended)_.
### Add TestRail tests Runs
You can add a TestRail tests Runs or tests Plan with all tests you want to automate.<br> 
If you don't, the Reporter will publish Jest tests results into the new TestRail test Run.<br>
Each time the Jest runs tests the Reporter parse all TestRail tests Plans
<br>and tests Runs of the Milestone to collect testcases.
The Reporter collects only unique testcases,
<br>if you have several tests Runs with one testcase
then The Reporter push the test result only to one of that Runs.

## Example tests

The Case ID from TestRail may be added to **_it()_** description 
each test result you want to push to TestRail.
You can specify several cases in one **_it()_** description.
#### Usage
```javascript
describe("Tests suite", () => {
  // "C123" this is Case ID from Test Rail
  it("C123 test success", async () => {
    expect(1).toBe(1);
  });

  it("Test fail C124 C125", async () => {
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
- ~~Add new tests Run if there are testcases that are not present in any of the existing TestRail tests Runs.~~ >> **Done in 1.1.0**
- Add new test Runs if the Milestone not specified.
- Add new TestRail Milestone if the specified Milestone not present in the Project.
- ~~Also need to write more tests.~~                                   >> **Done in 1.0.4**
- ~~Added ability to specify several case_ids in one test description~~ >> **Done in 1.0.6**
- ~~Added JSON validator to API interface~~ >> **Done in 1.0.7**
- Migrate to GOT

<br>**Version 2:**
- Add the Reporter CLI.

<br>**Version 3:**
- Add ability to parse code annotations.
- Add new TestRail testcase if **_it()_** description not specified by Case ID.
- Add maintenance the TestRail test Plan and test Configurations.


## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/AntonChaukin/testrail-jest-reporter/blob/main/LICENSE) file for details.

## Support

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/chaukinantv)
