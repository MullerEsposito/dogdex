import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../server';
import nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');

// Mock ML model loading to avoid delays/errors in tests
jest.mock('../ml/model', () => ({
  loadModel: (jest.fn() as any).mockResolvedValue(true),
  classifyDog: (jest.fn() as any).mockResolvedValue({ breed: 'Labrador', confidence: 0.9 }),
}));

describe('Support API', () => {
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

  it('should return 400 if type or text is missing', async () => {
    const response = await request(app)
      .post('/support')
      .send({ type: 'bug' });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('should send an email and return 200 on success', async () => {
    const response = await request(app)
      .post('/support')
      .field('type', 'bug')
      .field('text', 'Test message')
      .field('userName', 'Tester')
      .field('userEmail', 'test@example.com');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(mockSendMail).toHaveBeenCalled();
    
    const mailOptions = mockSendMail.mock.calls[0][0] as any;
    expect(mailOptions.subject).toContain('Tester');
    expect(mailOptions.html).toContain('Tester');
    expect(mailOptions.html).toContain('test@example.com');
  });
});
