import { state } from '@angular/animations';
import {test, expect} from '@playwright/test';
import { timeout } from 'rxjs-compat/operator/timeout';
test.beforeEach(async ({page}, testInfo) => {
    await page.goto(process.env.URL)
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 20000) // set the timeout for the test to 20 seconds
})  

test('Auto waiting for elements', async ({page}) => {
    const successButton = page.locator('.bg-success')
    // await successButton.click() // click on the button that triggers the AJAX request

    // const text = await successButton.textContent() // get the text content of the button after the AJAX request is completed
    // await successButton.waitFor({state: "attached"}) // wait for the button to be visible after the AJAX request is completed
    // const text = await successButton.allTextContents() // get the text content of the button after the AJAX request is completed
    // expect(text).toContain('Data loaded with AJAX get request.') // assert that the text content of the button is "Data loaded"

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000}) // assert that the text content of the button is "Data loaded"
})

test.skip('Alternative waiting ', async ({page}) => {
    const successButton = page.locator('.bg-success')

    // ___ wait for element
    // await page.waitForSelector('.bg-success')

    // ___ wait for particular response
    // await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // ___ wait for network calls to be completed ("NOT RECOMMENDED")

    await page.waitForLoadState('networkidle') // wait for all network calls to be completed after the AJAX request is completed

    const text = await successButton.allTextContents() // get the text content of the button after the AJAX request is completed
    expect(text).toContain('Data loaded with AJAX get request.') // assert that the text content of the button is "Data loaded"
})
test('timeout', async ({page}) => {
    // test.setTimeout(10000) // set the timeout for the test to 10 seconds
    test.slow() // mark the test as slow, which will increase the timeout for the test to 30 seconds
    const successButton = page.locator('.bg-success')
    await successButton.click() // click on the button that triggers the AJAX request
})