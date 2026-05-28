import { expect, Locator, Page } from '@playwright/test'
import { HelperBase } from './helperBase'

export class FormLayoutsPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }
    
    async submitUsingTheGridFormWithCredentialsAndSelectOption(email: string, password: string, optionText: string) {
        const usingTheGridForm = this.page.locator('nb-card',{hasText:"Using the Grid"})
        await usingTheGridForm.getByRole('textbox', { name: 'Email'}).fill(email)
        await usingTheGridForm.getByLabel('Password').fill(password)
        await usingTheGridForm.getByText(optionText, { exact: true }).click()
        await expect(usingTheGridForm.getByRole('radio', { name: optionText })).toBeChecked()
        await usingTheGridForm.getByRole('button').click()
    }
    /**
     * This method submits the inline form with the provided name, email, and remember me option.
     * @param name - The name to be filled in the form.
     * @param email - The email to be filled in the form.
     * @param rememberMe - A boolean indicating whether to check the "Remember me" option or not.
     */
    async submitImlineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean) {
        const InLineForm = this.page.locator('nb-card',{hasText:"Inline form"})
        await InLineForm.getByRole('textbox', { name: 'Jane Doe'}).fill(name)
        await InLineForm.getByRole('textbox', { name: 'Email'}).fill(email)
        if (rememberMe) {
            await InLineForm.getByText('Remember me', { exact: true }).click()
            await expect(InLineForm.getByRole('checkbox', { name: 'Remember me' })).toBeChecked()
        }
        await InLineForm.getByRole('button').click()
    }
}
