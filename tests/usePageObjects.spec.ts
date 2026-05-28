import {test, expect} from '@playwright/test';
import {PageManager} from '../page-object/pageManager';
import {faker} from '@faker-js/faker';

test.beforeEach(async ({page}) => {
    await page.goto('/') // base url from paywright.config.ts file, so we can use relative url in the tests
})

test('navigate to form page @smoke @regression', async ({page}) => {
    const pm = new PageManager(page);
    await pm.navigateTo().FormLayoutsPage();
    await pm.navigateTo().DatepickerPage();
    await pm.navigateTo().ToasterPage();
    await pm.navigateTo().TooltipPage();
    await pm.navigateTo().SmartTablePage();
})

test('paramrized methods @smoke', async ({page}) => {
    const pm = new PageManager(page);
    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int({min: 1, max: 100})}@test.com`;
    const randomPassword = faker.internet.password();

    await pm.navigateTo().FormLayoutsPage();
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(randomEmail, randomPassword, 'Option 1');
    // await page.screenshot({path: 'screenshots/submitUsingTheGridFormWithCredentialsAndSelectOption.png', fullPage: true}) // screenshot for debugging purposes
    await pm.onFormLayoutsPage().submitImlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true); 
    // await pm.navigateTo().DatepickerPage();
    // await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(5);
    // await pm.onDatepickerPage().DatepickerWithRangeFromToday(6, 15);
})
