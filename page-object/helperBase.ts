import { Locator, Page, expect } from '@playwright/test'

export class HelperBase {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async waitForNumberOfseconds (timeInSeconds: number) {
        await this.page.waitForTimeout(timeInSeconds * 1000)
    }
}