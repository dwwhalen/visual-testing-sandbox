import { test, expect, type Page } from '@playwright/test';
import { time } from 'console';
import exp from 'constants';
const os = require('os');
const path = require('path');

test.beforeEach(async ({ page }) => {
  page.goto('/');
});

test.describe('Initial page load', () => {
  test('@visual initial page is visually correct', async ({ page }) => {

    await expect(page.locator('#datetime-label')).toHaveText('Current Date and Time:');

    const datetimeValue = page.locator('#datetime-value');

    // Verify that the datetime value element is visible
    await expect(datetimeValue).toBeVisible();

    // Get the text content of the datetime value element
    const datetimeText = await datetimeValue.textContent();

    // Check if datetimeText is a valid date string
    if (datetimeText && !isNaN(Date.parse(datetimeText))) {
      const datetimeDate = new Date(datetimeText).toLocaleDateString();
      const currentDate = new Date().toLocaleDateString();

      // Assert that the date part of the datetime value is equal to the current date
      expect(datetimeDate).toBe(currentDate);
    } else {
      throw new Error('Invalid datetime text');
    }

    await expect(page).toHaveScreenshot(
      [os.platform(), 'landing.png'],
      {
        stylePath: path.join(__dirname, 'screenshot.css'),
        timeout: 10000,
      });

    // const datetimeElement = page.locator('#datetime');
    // await expect(datetimeElement).toBeVisible();

    // await expect(page).toHaveScreenshot(
    //   [os.platform(), 'landing.png'],
    //   {
    //     timeout: 10000,
    //     mask: [
    //       datetimeElement
    //     ]
    //   });
  });
})
