import {test, expect} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('/') // base url from paywright.config.ts file, so we can use relative url in the tests
})

test.describe('Forms Loyout page', () => {
    test.describe.configure({retry: 0}) // retry failed tests in this describe block up to 2 times
    test.describe.configure({mode: 'serial'}) // run the tests in this describe block in serial mode, so they will run one after another, and if one test fails, the next test will not run, but it will retry the failed test up to 2 times before moving to the next test 


    test.beforeEach(async ({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input field', async ({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card',{hasText:"Using the Grid"}).getByRole('textbox', { name: 'Email'})
        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test@test6.com')
    
        // generic assertions
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toBe('test@test6.com')

        // locators assertions
        await expect(usingTheGridEmailInput).toHaveValue('test@test6.com')

    })

    test('radio buttons', async ({page}) => {
        const usingTheGridForm = page.locator('nb-card',{hasText:"Using the Grid"})
        await usingTheGridForm.locator('nb-radio', { hasText: 'Option 2' }).locator('label .text').click()
        await expect(usingTheGridForm.getByRole('radio', { name: 'Option 2' })).toBeChecked()
        await expect(usingTheGridForm.getByRole('radio', { name: 'Option 1' })).not.toBeChecked()
    })
})

test('checkboxes', async ({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()
    await page.getByRole('checkbox',{name: 'Hide on click'}).check({force: true}) 
    await page.getByRole('checkbox',{name: "Prevent arising of duplicate toast"}).click({force: true}) // you can use check & uncheck methods as well, but they will not work if the checkbox is hidden, so you need to use click method with force: true option
    const allboxes = page.getByRole('checkbox')
    for(const box of await allboxes.all()) {
        await box.uncheck({force: true})
        expect(await box.isChecked()).toBeFalsy()  
    }
})

test('lists & dropdowns', async ({page}) => {
    const dropdownMenu = page.locator('ngx-header nb-select')
    await dropdownMenu.click()

    page.getByRole('list') //when the list is a UL tag
    page.getByRole('listitem') // when the list is a LI tag

    // const optionList = page.getByRole('list').locator('nb-option') // when the options are in a select tag
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({hasText: "Cosmic"}).click() // click on the second option in the list
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)') // assert that the background color of the header is "rgb(50, 50, 89)"

    const colors = {
        Light: 'rgb(255, 255, 255)',
        Dark: 'rgb(34, 43, 69)',
        Cosmic: 'rgb(50, 50, 89)',
        Corporate: 'rgb(255, 255, 255)'
    }

    await dropdownMenu.click()
    for(const color in colors) {
        await optionList.filter({hasText: color}).click() // click on the option in the list that has the text "color"
        await expect(header).toHaveCSS('background-color', colors[color]) // assert that the background color of the header is the color that we clicked on
        if (color !== 'Corporate') 
            await dropdownMenu.click() // click on the dropdown menu to open it again, but not for the last option because we don't want to open the dropdown menu after clicking on the last option
    }
})

test('tooltips', async ({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()
    const toolTipCard = page.locator('nb-card').filter({hasText: "Tooltip Placement"})
    await toolTipCard.getByRole('button', { name:'Top'}).hover() // hover over the button that has the text "Top"

    page.getByRole('tooltip') // if you have a role tooltip created
    const tooltip = await page.locator('nb-tooltip').textContent() 
    expect(tooltip).toEqual('This is a tooltip') // assert that the text content of the tooltip is "This is tooltip"
})

test('dialog box', async ({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?') // assert that the message of the dialog is "Are you sure you want to delete?"
        dialog.accept() // accept the dialog
    })

    await page.getByRole('table').locator('tr', {hasText:'mdo@gmail.com'}).locator('.nb-trash').click() // click on the delete button for the row that has the text "
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com') // assert that the first row of the table does not have the text "
})

test('web tables', async ({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()
    
    // 1 get the row by any test in the row
    const targetRow = page.getByRole('row',{name:'snow@gmail.com'})
    await targetRow.locator('.nb-edit').click() // click on the edit button for the row that has the text "
    await page.locator('input-editor').getByPlaceholder('Age').clear() // clear the age input
    await page.locator('input-editor').getByPlaceholder('Age').fill('55') // fill the age input with the value "55"
    await page.locator('.nb-checkmark').click() // click on the checkmark button to save the changes

    // 2 get the row based on the value of a specific colomn
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click() // click on the second page of the table
    const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')}) // get the row that has the value "11" in the second column (the first column is the index column, so we are looking for the value "11" in the second column)
    await targetRowById.locator('.nb-edit').click() // click on the edit button for the row that has the value "11" in the second column
    await page.locator('input-editor').getByPlaceholder('E-mail').clear() // clear the email input
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test-new-email@example.com') // fill the email input with the value "test-new-email@example.com"
    await page.locator('.nb-checkmark').click() // click on the checkmark button to save the changes
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test-new-email@example.com') // assert that the value of the email column for the row that has the value "11" in the second column is "
    
    const ages = ["20", "30", "40", "200"]
    for(const age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear() // clear the age input
        await page.locator('input-filter').getByPlaceholder('Age').fill(age) // fill the age input with the value "100"
        await page.waitForTimeout(500) // wait for the table to be updated after filling the age input
        const ageRows = page.locator('tbody tr') // get all the rows of the table
        for(const row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent() // get the text content of the last cell of the row (the age column)
            if (age === "200") {
                expect(await page.getByRole('table').textContent()).toContain('No data found') // assert that the table has the text "No Data Found" when we fill the age input with the value "200", because there are no rows with the age "200"
            }else {
                expect(cellValue).toEqual(age) // assert that the value of the age column for each row is equal to the value that we filled in the age input    
            }
        }
        
    }
})  

test('datepicker', async ({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click() // click on the datepicker input to open the datepicker

    let date = new Date()
    date.setDate(date.getDate() + 7) // get the date for tomorrow
    const expectedDate = date.getDate().toString() // get the day of the month for tomorrow and convert it to a string
    const expectedMonthShort = date.toLocaleString('en-US', { month: 'short' }) // get the short name of the month for tomorrow (e.g. "Apr" for April)
    const expectedMonthLong = date.toLocaleString('en-US', { month: 'long' }) // get the long name of the month for tomorrow (e.g. "April" for April)
    const expectedYear = date.getFullYear().toString() // get the year for tomorrow and convert it to a string
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}` // create the expected date string in the format "Apr 1, 2026"

    let calendarMonthAndYear = (await page.locator('nb-calendar-view-mode').textContent())?.trim() ?? '' // get and normalize the calendar header text that contains the month and year
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}` // create the expected month and year string in the format "April 2026"
    for (let i = 0; i < 12 && calendarMonthAndYear !== expectedMonthAndYear; i++) { // bounded loop to prevent infinite waits
        await page.locator('nb-calendar-pageable-navigation button').nth(1).click() // click right navigation button (next month)
        calendarMonthAndYear = (await page.locator('nb-calendar-view-mode').textContent())?.trim() ?? '' // read updated month/year header
    }

    await page.locator('nb-calendar-day-cell:not(.bounding-month)').getByText(expectedDate, {exact: true}).click() // click expected day only in current month to avoid duplicate days from adjacent months
    await expect(calendarInputField).toHaveValue(dateToAssert) // assert that the value of the datepicker input is "Apr 1, 2026"
})

test('slider', async ({page}) => {
    // Update attribute
    // const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    // await tempGauge.evaluate(node => {
    //     node.setAttribute('cx', '232.630') // set the "cy" attribute of the circle element to "10" to move the slider to the top position
    //     node.setAttribute('cy', '232.630') // set the "cy" attribute of the circle element to "10" to move the slider to the top position

    // })
    // await tempGauge.click() // click on the slider to trigger any events associated with it

    // Mouse actions
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded() // scroll to the slider element if it's not in the viewport

    const box = await tempBox.boundingBox() // get the bounding box of the slider element to know its position and dimensions
    const x = box.x + box.width / 2 // calculate the x coordinate for the center of the slider
    const y = box.y + box.height / 2 // calculate the y coordinate for the center of the slider
    await page.mouse.move(x, y) // move the mouse to the center of the slider
    await page.mouse.down() // click and hold the mouse button to start dragging
    await page.mouse.move(x+100, y) // move the mouse to the right by 100 pixels to drag the slider to the new position
    await page.mouse.move(x+100, y+100) // move the mouse to the right and down by 100 pixels to drag the slider to the new position (you can adjust the values to move the slider to the desired position)
    await page.mouse.up() // release the mouse button to drop the slider at the new position
    await expect(tempBox).toContainText('30') // assert that the slider value is "30" after dragging (you can adjust the expected value based on the slider's scale and the position you dragged it to)
})