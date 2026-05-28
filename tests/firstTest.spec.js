import {test, expect} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('/') // base url from paywright.config.ts file, so we can use relative url in the tests
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()

})          

test('Locator syntax rules', async ({page}) => {
    // By Tag text
    page.locator('input')
    // By ID
    await page.locator('#inputEmail1').click() // # - means that we are looking for an element with a specific ID
    // By Class
    page.locator('.shape-rectangle') // . - means that we are looking for a class
    // By Attribute
    page.locator('[placeholder="Email"]') // [] - means that we are looking for an element with a specific attribute
    // By Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]');

    // Combination of differemt locators
    page.locator('input[placeholder="Email"]') 

    // By XPath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]') // // - means that we are looking for an element with a specific ID

    // By Partial text match
    page.locator(':text=("Using")') // text= - means that we are looking for an element with a specific text

    // By Text (exact match)
    page.locator('text-ispwd="Using the Grid"') // text= - means that we are looking for an element with a specific text
})

test('User testing locators', async ({page}) => {
await page.getByRole('textbox', { name: 'Email' }).first().click() // role= - means that we are looking for an element with a specific role
await page.getByRole('button', { name: 'Sign in' }).first().click() // role= - means that we are looking for an element with a specific role
await page.getByLabel('Email').first().click() // label= - means that we are looking for an element with a specific label
await page.getByPlaceholder('Jane Doe').first().click() // placeholder= - means that we are looking for an element with a specific placeholder
await page.getByText('Using the Grid').first().click() // text= - means that we are looking for an element with a specific text
await page.getByTestId('SignIn').click() // testid= - means that we are looking for an element with a specific test ID
// await page.getByTitle('IoT Dashboard').click() // title= - means that we are looking for an element with a specific title
})

test('Locating child elements', async ({page}) => {
await page.locator('nb-card nb-radio :text-is("Option 1")').click() // :text-is() - means that we are looking for an element with a specific text, but it has to be an exact match
await page.locator('nb-card nb-radio :text-is("Option 2")').click()
await page.locator('nb-card').getByRole('button', { name: 'Sign in'}).first().click() // role= - means that we are looking for an element with a specific role, but it has to be a child of the nb-card element
await page.locator('nb-card').nth(3).getByRole('button').first().click() // not the best practise / role= - means that we are looking for an element with a specific role, but it has to be a child of the second nb-card element
})

test('Locating parent elements', async ({page}) => {
await page.locator('nb-card',{hasText:"Using the Grid"}).getByRole('textbox', { name: 'Email'}).click() // role= - means that we are looking for an element with a specific role, but it has to be a child of the nb-card element that has the text "Using the Grid"
await page.locator('nb-card',{has: page.locator('#inputEmail1')}).getByRole('textbox', { name: 'Email'}).click() // role= - means that we are looking for an element with a specific role, but it has to be a child of the nb-card element that has the #inputEmail1 element as a child
await page.locator('nb-card').filter({hasText: "Basic Form"}).getByRole('textbox', { name: 'Email'}).click() // role= - means that we are looking for an element with a specific role, but it has to be a child of the nb-card element that has the text "Using the Grid"
await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', { name: 'Password'}).click() // role= - means that we are looking for an element with a specific role, but it has to be a child of the nb-card element that has the #inputEmail1 element as a child
await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText:'Sign in'}).getByRole('textbox', { name: 'Email'}).click() // role= - means that we are looking for an element with a specific role, but it has to be a child of the nb-card element that has the nb-checkbox element as a child and has the text "Sign in"
await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', { name: 'Email'}).click() // .. - means that we are looking for the parent element of the element that has the text "Using the Grid", and then we are looking for a child element with a specific role
})

test('Reusing locators', async ({page}) => {
const basicForm = page.locator('nb-card').filter({hasText: "Basic Form"}) // we are storing the locator for the nb-card element that has the text "Basic Form" in a variable called basicForm
const emailInput = basicForm.getByRole('textbox', { name: 'Email'}) // we are storing the locator for the textbox element with the name "Email" that is a child of the basicForm element in a variable called emailInput
const passwordInput = basicForm.getByRole('textbox', { name: 'Password'}) // we are storing the locator for the textbox element with the name "Password" that is a child of the basicForm element in a variable called passwordInput

    await emailInput.fill('test@example.com')
    await passwordInput.fill('TestPassword')
    await basicForm.locator('nb-checkbox').click() // we are clicking on the checkbox element that is a child of the basicForm element  
    await basicForm.getByRole('button').click()

    await expect(emailInput).toHaveValue('test@example.com') // we are asserting that the value of the emailInput element is "

})

test('Extracting values from locators', async ({page}) => {
// sing test values
const basicForm = page.locator('nb-card').filter({hasText: "Basic Form"})
const buttonText = await basicForm.getByRole('button').textContent() // we are extracting the text content of the button element that is a child of the basicForm element and storing it in a variable called buttonText
expect(buttonText).toEqual('Submit')

// all text values
const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents() // we are extracting the text content of all the nb-radio elements and storing it in an array
expect(allRadioButtonsLabels).toContain('Option 1')

//input values
const emailInput = basicForm.getByRole('textbox', { name: 'Email'})
await emailInput.fill('test@example.com')
const emailInputValue = await emailInput.inputValue() // we are extracting the value of the emailInput element and storing it in a variable called emailInputValue
expect(emailInputValue).toEqual('test@example.com')

const placeholderValue = await emailInput.getAttribute('placeholder') // we are extracting the value of the placeholder attribute of the emailInput element and storing it in a variable called placeholderValue
expect(placeholderValue).toEqual('Email')
})

test.skip('Assertions', async ({page}) => {
     const basicFormButton = page.locator('nb-card').filter({hasText: "Basic Form"}).locator('button') // we are storing the locator for the button element that is a child of the nb-card element that has the text "Basic Form" in a variable called basicFormButton
    
     // General assertions
    const value = 5 
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual('Submit')

    // Locator assertions
    await expect(basicFormButton).toHaveText('Submit') // we are asserting that the basicFormButton element has the text "Submit"

    // Soft assertions (not the best practise, but it can be useful in some cases)
    await expect.soft(basicFormButton).toHaveText('Submit5') 
    await basicFormButton.click() // we are clicking on the basicFormButton element, even if the previous assertion fails
}) 