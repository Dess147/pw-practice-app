import { Locator, Page, expect } from '@playwright/test'
import { HelperBase } from './helperBase'

export class DatepickerPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    // async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
    //     const calendarInputField = this.page.getByPlaceholder('Form Picker')
    //     await calendarInputField.click() // click on the datepicker input to open the datepicker
    
    //     let date = new Date()
    //     date.setDate(date.getDate() + numberOfDaysFromToday) // calculate the date that is "numberOfDaysFromToday" days from today
    //     const expectedDate = date.getDate().toString() // get the day of the month for tomorrow and convert it to a string
    //     const expectedMonthShort = date.toLocaleString('en-US', { month: 'short' }) // get the short name of the month for tomorrow (e.g. "Apr" for April)
    //     const expectedMonthLong = date.toLocaleString('en-US', { month: 'long' }) // get the long name of the month for tomorrow (e.g. "April" for April)
    //     const expectedYear = date.getFullYear().toString() // get the year for tomorrow and convert it to a string
    //     const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}` // create the expected date string in the format "Apr 1, 2026"
    
    //     let calendarMonthAndYear = (await this.page.locator('nb-calendar-view-mode').textContent())?.trim() ?? '' // get and normalize the calendar header text that contains the month and year
    //     const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}` // create the expected month and year string in the format "April 2026"
    //     for (let i = 0; i < 12 && calendarMonthAndYear !== expectedMonthAndYear; i++) { // bounded loop to prevent infinite waits
    //         await this.page.locator('nb-calendar-pageable-navigation button').nth(1).click() // click right navigation button (next month)
    //         calendarMonthAndYear = (await this.page.locator('nb-calendar-view-mode').textContent())?.trim() ?? '' // read updated month/year header
    //     }
    
    //     await this.page.locator('nb-calendar-day-cell:not(.bounding-month)').getByText(expectedDate, {exact: true}).click() // click expected day only in current month to avoid duplicate days from adjacent months
    //     await expect(calendarInputField).toHaveValue(dateToAssert) // assert that the value of the datepicker input is "Apr 1, 2026"

    // }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click() // click on the datepicker input to open the datepicker
        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday) // select the date in the calendar and get the expected date string for assertion
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    async DatepickerWithRangeFromToday (startdayFromToday: number, endDayFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()
        const startDateToAssertStart = await this.selectDateInTheCalendar(startdayFromToday) 
        const endDateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday)
        const dateToAssert = `${startDateToAssertStart} - ${endDateToAssertEnd}`
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday) // calculate the date that is "numberOfDaysFromToday" days from today
        const expectedDate = date.getDate().toString() // get the day of the month for tomorrow and convert it to a string
        const expectedMonthShort = date.toLocaleString('en-US', { month: 'short' }) // get the short name of the month for tomorrow (e.g. "Apr" for April)
        const expectedMonthLong = date.toLocaleString('en-US', { month: 'long' }) // get the long name of the month for tomorrow (e.g. "April" for April)
        const expectedYear = date.getFullYear().toString() // get the year for tomorrow and convert it to a string
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}` // create the expected date string in the format "Apr 1, 2026"
    
        let calendarMonthAndYear = (await this.page.locator('nb-calendar-view-mode').textContent())?.trim() ?? '' // get and normalize the calendar header text that contains the month and year
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}` // create the expected month and year string in the format "April 2026"
        for (let i = 0; i < 12 && calendarMonthAndYear !== expectedMonthAndYear; i++) { // bounded loop to prevent infinite waits
            await this.page.locator('nb-calendar-pageable-navigation button').nth(1).click() // click right navigation button (next month)
            calendarMonthAndYear = (await this.page.locator('nb-calendar-view-mode').textContent())?.trim() ?? '' // read updated month/year header
        }
    
        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact: true}).click() // click expected day only in current month to avoid duplicate days from adjacent months
        return dateToAssert
    }  

}
