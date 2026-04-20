import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../server';
import nodemailer from 'nodemailer';

jest.mock('nodemailer');
jest.mock('../ml/model', () => ({
  loadModel: (jest.fn() as any).mockResolvedValue(true),
  classifyDog: (jest.fn() as any).mockResolvedValue({ breed: 'Labrador', confidence: 0.9 }),
}));

describe('Security Features', () => {
  let mockSendMail: jest.Mock;

  beforeEach(() => {
    mockSendMail = (jest.fn() as any).mockResolvedValue({ messageId: 'test-id' });
    (nodemailer.createTransport as any).mockReturnValue({
      sendMail: mockSendMail,
    });
    (nodemailer.createTestAccount as any).mockResolvedValue({
      user: 'test-user',
      pass: 'test-pass',
    });
  });

  it('should sanitize HTML tags in userName and text (XSS Protection)', async () => {
    const response = await request(app)
      .post('/support')
      .send({
        type: 'bug',
        text: 'Dangerous <script>alert(1)</script>',
        userName: '<b>Attacker</b>'
      });

    expect(response.status).toBe(200);
    expect(mockSendMail).toHaveBeenCalled();
    
    const mailOptions = mockSendMail.mock.calls[0][0] as any;
    // Verify that the HTML tags are escaped
    expect(mailOptions.html).toContain('&lt;script&gt;');
    expect(mailOptions.html).toContain('&lt;b&gt;');
    expect(mailOptions.html).not.toContain('<script>');
    expect(mailOptions.html).not.toContain('<b>');
  });

  it('should reject large files (Multer Limit)', async () => {
    // Create a large buffer (2MB)
    const largeBuffer = Buffer.alloc(2 * 1024 * 1024, 'a');

    const response = await request(app)
      .post('/support')
      .attach('screenshot', largeBuffer, 'huge.jpg')
      .field('type', 'bug')
      .field('text', 'test');

    // Multer triggers an error which we handle in our global error handler
    expect(response.status).toBe(500); // Or 400 depending on how Multer error is caught
    expect(response.body.error).toContain('large');
  });

  it('should reject non-image files', async () => {
    const response = await request(app)
      .post('/support')
      .attach('screenshot', Buffer.from('fake data'), 'malicious.exe')
      .field('type', 'bug')
      .field('text', 'test');

    expect(response.status).toBe(500);
    expect(response.body.error).toContain('arquivo não suportado');
  });
});
