import { test, expect } from '@playwright/test';

test.describe('Support Flow', () => {
  test('should submit a support report successfully', async ({ page }) => {
    // Navigate to the support screen
    // Note: Expo Router path for support is usually /support
    await page.goto('/support', { waitUntil: 'domcontentloaded' });

    // Verify we are on the support page
    await expect(page.getByText('SUPORTE & FEEDBACK')).toBeVisible();

    // Fill in the contact information
    await page.getByPlaceholder('Seu nome').fill('Playwright Tester');
    await page.getByPlaceholder('Seu e-mail').fill('playwright@example.com');

    // Fill in the description
    const descriptionPlaceholder = 'Descreva o erro que você encontrou...';
    await page.getByPlaceholder(descriptionPlaceholder).fill('This is an E2E test from Playwright.');

    // Click the submit button
    // Handle the browser alert dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Enviado!');
      await dialog.accept();
    });

    await page.getByText('ENVIAR RELATÓRIO').click();

    // Verify success by checking if we navigated back or just by the dialog handling above
    // Since Alert.alert is blocking, the dialog handler is enough to verify success.
  });
});
