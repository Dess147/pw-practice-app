// The general commands that are used in the project

//* npm init playwright@latest -> to initialize the project with Playwright
//* npm start -> to start the test runner in interactive mode
//* npx playwright test -> to run all the tests in the project

// npx playwright test example.spec.js --project=chromium  -> to run the test in chromium browser
// npx playwright test -g "has title" --project=chromium   -> to run the test with the name "has title" in chromium browser
// npx playwright show-report                              -> to show the report of the test run

// test.skip('has title'... -> to skip the test with the name "has title"
// test.only('has title'... -> to run only the test with the name "has title"
// npx playwright test --project=chromium --reporter=list -> to run the test in chromium browser and show the report in list format
// npx playwright test --project=chromium --reporter=html -> to run the test in chromium browser and show the report in html format

// ------
// npx playwright test --ui -> to run the test in interactive mode, where you can select the test to run and see the results in real time
// npx playwright test --debug -> to run the test in debug mode, where you can see the test execution in real time and debug the test if it fails
// npx playwright test --project=chromium --trace only -> to run the test in chromium browser and generate a trace file that can be used for debugging
// npx playwright test --config=playwright-prod.config.ts -> to run the test with the configuration specified in the playwright-prod.config.ts file
// npx playwright test --project=chromium --grep @smoke -> to run the tests that are tagged with @smoke in chromium browser
// --- install libs
// npm i @faker-js/faker --save-dev --force -> to install the faker library for generating fake data in the tests https://www.npmjs.com/package/@faker-js/faker
// -----
// allure generate ./allure-results -o ./allure-report // to generate the allure report from the allure results
// allure open ./allure-report // to open the allure report in the browser