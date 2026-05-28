import {test} from '../test-options';
import {PageManager} from '../page-object/pageManager';
import {faker} from '@faker-js/faker';

// test.beforeEach(async ({page}) => {
//     await page.goto('/') // base url from paywright.config.ts file, so we can use relative url in the tests
// })


test('paramrized methods', async ({pageManager}) => {
    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int({min: 1, max: 100})}@test.com`;
    const randomPassword = faker.internet.password();

    // await pm.navigateTo().FormLayoutsPage();
    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(randomEmail, randomPassword, 'Option 1');
    await pageManager.onFormLayoutsPage().submitImlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true); 
})
