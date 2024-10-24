import { test, expect, type Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.beforeEach(async ({ page }) => {
    page.goto('/');
});

test.describe('New Todo', () => {
    test('@visual should allow me to add todo items', async ({ page }) => {
        await expect(page).toHaveScreenshot('landing.png');
    });
});
