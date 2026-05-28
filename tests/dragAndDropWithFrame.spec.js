import {expect} from '@playwright/test';
import {test} from '../test-options'; // import the custom test with the extended options

test('drag and drop with iframe', async ({page, globalsQAURL}) => {
    await page.goto(globalsQAURL, { waitUntil: 'domcontentloaded', timeout: 30000 })

    // Third-party consent layers on this site are flaky and can re-appear, blocking mouse actions.
    await page.addStyleTag({
        content: '.fc-consent-root, .fc-dialog-overlay { display: none !important; visibility: hidden !important; pointer-events: none !important; }',
    })
    await page.evaluate(() => {
        const removeConsent = () => {
            document.querySelectorAll('.fc-consent-root, .fc-dialog-overlay').forEach((node) => node.remove())
        }
        removeConsent()
        const observer = new MutationObserver(removeConsent)
        observer.observe(document.documentElement, { childList: true, subtree: true })
    })

    // Dismiss cookie consent if present; its overlay intercepts drag pointer events.
    const consentDialog = page.getByRole('dialog', { name: /consent to use your data/i })
    const consentButton = consentDialog.getByRole('button', { name: 'Consent' })
    const consentVisible = await consentButton.isVisible({ timeout: 7000 }).catch(() => false)
    if (consentVisible) {
        await consentButton.click().catch(async () => {
            await consentButton.click({ force: true })
        })
    }

    await page.locator('.fc-dialog-overlay').waitFor({ state: 'hidden', timeout: 10000 }).catch(async () => {
        await page.evaluate(() => {
            document.querySelectorAll('.fc-consent-root, .fc-dialog-overlay').forEach((node) => node.remove())
        })
    })

    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
    await frame.locator('li', {hasText: 'High Tatras 2'}).scrollIntoViewIfNeeded()
    await frame.locator('#trash').scrollIntoViewIfNeeded()
    await frame.locator('li', {hasText: 'High Tatras 2'}).dragTo(frame.locator('#trash'))
    await expect(frame.locator('#trash li', {hasText: 'High Tatras 2'})).toBeVisible()

    // More precice control
    await frame.locator('li', {hasText: 'High Tatras 4'}).hover() // hover over the element to be dragged to ensure it is visible and interactable
    await page.mouse.down() // press the mouse button down to start the drag operation
    await frame.locator('#trash').hover() // hover over the target element to ensure it is visible and interactable
    await page.mouse.up() // release the mouse button to drop the element on the target

    await expect(frame.locator('#trash li h5')).toHaveText(['High Tatras 2', 'High Tatras 4']) // assert that the text content of the elements in the trash is "High Tatras 2" and "High Tatras 4" (in drop order)
})