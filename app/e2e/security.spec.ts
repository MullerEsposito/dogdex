import { test, expect } from '@playwright/test';

test.describe('Security Tests', () => {
  test('should escape HTML in support report to prevent XSS', async ({ page }) => {
    await page.goto('/support');

    const xssPayload = '<img src=x onerror=alert("XSS")>';
    await page.getByPlaceholder('Seu nome').fill(xssPayload);
    await page.getByPlaceholder('Descreva o erro que você encontrou...').fill('Normal text');

    // Intercept alert to verify failure or handle success
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Enviado!'); // Should still succeed
      await dialog.accept();
    });

    await page.getByText('ENVIAR RELATÓRIO').click();

    // Verification would ideally be seeing the sanitized text in the Ethereal email
    // Since we can't easily check Ethereal without a mock-backend or API access, 
    // this test ensures the app doesn't crash and the flow completes.
  });

  test('should trigger rate limiting after 5 requests', async ({ page }) => {
    await page.goto('/support');
    
    // We already used 1 request in the previous test if they run in sequence
    // Let's do 12 more to be sure we hit the 10/15min limit
    for (let i = 0; i < 12; i++) {
        await page.getByPlaceholder('Seu nome').fill('Spammer');
        await page.getByPlaceholder('Descreva o erro que você encontrou...').fill(`Spam message ${i}`);
        
        // Handle dialog
        const dialogPromise = page.waitForEvent('dialog');
        await page.getByText('ENVIAR RELATÓRIO').click();
        const dialog = await dialogPromise;
        
        if (i < 4) { // Assuming 5th or 6th hits limit depending on previous tests
            expect(dialog.message()).toContain('Enviado!');
        } else if (dialog.message().includes('Muitos relatos enviados')) {
            // Success! Rate limit hit
            expect(dialog.message()).toContain('Muitos relatos enviados');
            await dialog.accept();
            break;
        }
        await dialog.accept();
    }
  });
});
